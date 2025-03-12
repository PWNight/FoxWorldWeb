import {NextRequest, NextResponse} from "next/server";
import Joi from "joi";
import {query} from "@/lib/mysql";
import {getUserData} from "@/lib/utils";

const applicationSchema = Joi.object({
    about_user: Joi.string().required(),
    why_this_guild: Joi.string().required(),
})

export async function GET(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        const result = await getUserData(token);
        if ( !result.success ){
            return NextResponse.json(result, { status: result.status })
        }
        const user = result.data.profile;

        const [guildData] : any = await query(`SELECT * FROM guilds WHERE url = ?`, [url])
        if( !guildData ){
            return NextResponse.json({ success: false, message: 'Гильдия не найдена' }, { status: 400 })
        }

        const [guildAccess] : any = await query(`SELECT permission FROM guilds_members WHERE fk_guild = ? AND uid = ?`, [guildData.id, user.id])
        if( !guildAccess || guildAccess.permission != 2 ){
            return NextResponse.json({ success: false, message: 'У вас нету доступа к этой гильдии'}, { status: 400 });
        }

        const guildApplications : any = await query(`SELECT * FROM guilds_applications JOIN profiles ON fk_profile = profiles.id WHERE fk_guild = ? AND status = 'Рассматривается'`, [guildData.id])
        return NextResponse.json({ success: true, data: guildApplications }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Серверная ошибка',
            error: {
                message: error.message,
                code: error.code || 'UNKNOWN_ERROR'
            }
        }, {status:500})
    }
}

export async function POST(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();
    const { status, user_id } = data;
    if ( !status || !user_id ) {
        return NextResponse.json({ success: false, message: 'Ошибка валидации, отсутствует статус или айди пользователя' }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        const result = await getUserData(token);
        if ( !result.success ){
            return NextResponse.json(result, { status: result.status })
        }
        const user = result.data.profile;

        const [guildData] : any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if( !guildData ){
            return NextResponse.json({ success: false, message: 'Гильдия не найдена' },{status: 400})
        }

        const [guildAccess] : any = await query(`SELECT permission FROM guilds_members WHERE fk_guild = ? AND uid = ?`, [guildData.id, user.id])
        if( !guildAccess || guildAccess.permission != 2 ){
            return NextResponse.json({ success: false, message: 'У вас нету доступа к этой гильдии'}, { status: 400 });
        }

        const [userGuild] : any = await query('SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?', [user_id, guildData.id])
        if ( userGuild ){
            return NextResponse.json({ success: false, message: 'Пользователь уже является участником гильдии' },{status: 409})
        }

        const [guildApplication] : any = await query('SELECT * FROM guilds_applications WHERE fk_guild = ? AND fk_profile = ?',[guildData.id, user_id])
        if ( !guildApplication ){
            return NextResponse.json({ success: false, message: 'Заявка не найдена' },{status: 400})
        }

        await query('UPDATE guilds_applications SET status = ? WHERE fk_guild = ? AND fk_profile = ?',[status, guildData.id, user_id])

        if ( status == 'Принята' ) {
            await query("INSERT INTO guilds_members (fk_guild, uid, permission) VALUES (?, ?, ?)", [guildData.id, user_id, 0])
        }
        return NextResponse.json({ success: true, message: 'Заявка успешно обновлена' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Серверная ошибка',
            error: {
                message: error.message,
                code: error.code || 'UNKNOWN_ERROR'
            }
        }, {status:500})
    }
}

export async function PUT(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();

    const { error } = applicationSchema.validate(data);
    if (error) {
        return NextResponse.json({ success: false, message: 'Ошибка валидации', error: error.details }, { status: 400 });
    }

    const { about_user, why_this_guild } = data;

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        const result = await getUserData(token);
        if ( !result.success ){
            return NextResponse.json(result, { status: result.status })
        }
        const user = result.data.profile;

        const [guildData] : any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if( !guildData ){
            return NextResponse.json({ success: false, message: 'Гильдия не найдена' },{status: 400})
        }

        const [userGuild] : any = await query('SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?', [user.id, guildData.id])
        if ( userGuild ){
            return NextResponse.json({ success: false, message: 'Вы уже состоите в этой гильдии' },{status: 409})
        }

        await query('INSERT INTO guilds_applications (fk_guild, fk_profile, about_user, why_this_guild) VALUES (?, ?, ?, ?)', [guildData.id, user.id, about_user, why_this_guild])
        return NextResponse.json({ success: true, message: 'Заявка в гильдию отправлена' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Серверная ошибка',
            error: {
                message: error.message,
                code: error.code || 'UNKNOWN_ERROR'
            }
        }, {status:500})
    }
}