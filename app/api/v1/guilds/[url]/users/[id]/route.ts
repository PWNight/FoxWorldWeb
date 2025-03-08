import {NextRequest, NextResponse} from "next/server";
import {query} from "@/lib/mysql";
import Joi from "joi";

export async function GET(request: NextRequest, {params}: { params: Promise<{ url: string, id: number }> }) {
    const {url, id} = await params;
    try {
        let [guildUsers] : any = await query(`SELECT profiles.nick AS nickname, permission, member_since FROM guilds_members 
            JOIN profiles ON guilds_members.uid = profiles.id 
            JOIN guilds ON guilds_members.fk_guild = guilds.id 
            WHERE guilds.url = ? AND guilds_members.uid = ?`,
        [url, id])
        if( !guildUsers ){
            return NextResponse.json({success: false, message: "Пользователь или гильдия не найдены"}, {status:404});
        }
        return NextResponse.json({success: true, data: guildUsers}, {status:200})
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

export async function POST(request: NextRequest, {params}: { params: Promise<{ url: string, id: number }> }) {
    const {url, id} = await params;
    const data = await request.json();
    const permission = data.permission;

    const userSchema = Joi.object({
        permission: Joi.required()
    })

    const { error } = userSchema.validate(data);

    if ( error ) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`}
        })

        if ( !response.ok ){
            const errorData = await response.json()
            return NextResponse.json({success: false, message: 'Не удалось получить данные о пользователе', error: errorData || response.statusText},{status: response.status})
        }

        const json = await response.json()
        const user = json.profile;

        if( !user.inGuild ){
            return NextResponse.json({success: false, message: 'Вы не состоите в гильдии'},{status:401})
        }

        const [guildData] : any = await query('SELECT * FROM guilds WHERE url = ?', [url])
        if( !guildData ){
            return NextResponse.json({success: false, message: 'Гильдия не найдена'},{status:404})
        }

        const [userGuild] : any = await query('SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?', [user.id, guildData.id])
        if (userGuild.length == 0 || userGuild.permission != 2){
            return NextResponse.json({success: false, message: 'У вас нету доступа к этой гильдии'},{status:401})
        }

        if( permission == 2 ){
            await query("UPDATE guilds_members SET permission = 0 WHERE uid = ?", [user.id])
            await query("UPDATE guilds_members SET permission = 2 WHERE uid = ?",[id])
            await query("UPDATE guilds SET owner_id = ? WHERE owner_id = ?", [id, guildData.owner_id])
            return NextResponse.json({success: true, message: 'Гильдия успешно передана новому главе'},{status:401})
        }

        await query("UPDATE guilds_members SET permission = ? WHERE uid = ?", [permission, id])
        await query('UPDATE profiles SET in_guild = 1 WHERE id = ?', [id])

        return NextResponse.json({ success: true, message: "Уровень доступа игрока обновлён" }, { status: 200 });
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

export async function DELETE(request: NextRequest, {params}: { params: Promise<{ url: string, id: number }> }) {
    const {url, id} = await params;

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`}
        })

        if ( !response.ok ){
            const errorData = await response.json()
            return NextResponse.json({success: false, message: 'Не удалось получить данные о пользователе', error: errorData || response.statusText},{status: response.status})
        }

        const json = await response.json()
        const user = json.profile;

        const [guildData] : any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if( !guildData ){
            return NextResponse.json({success: false, message: 'Гильдия не найдена'},{status:404})
        }

        if( !user.inGuild ){
            return NextResponse.json({success: false, message: 'Вы не состоите в гильдии'},{status:401})
        }

        const [userGuilds] : any = await query('SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?', [user.id, guildData.id])
        if ( !userGuilds || userGuilds.permission != 2 ){
            return NextResponse.json({success: false, message: 'У вас нету доступа к этой гильдии'},{status:401})
        }

        await query("DELETE FROM guilds_members WHERE fk_guild = ? AND uid = ?", [guildData.id, id])
        await query('UPDATE profiles SET in_guild = 0 WHERE id = ?', [id])

        return NextResponse.json({success: true, message: 'Участник исключён из гильдии'},{status:200})
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