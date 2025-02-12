import {NextRequest, NextResponse} from "next/server";
import Joi from "joi";
import {query} from "@/lib/mysql";

const applicationSchema = Joi.object({
    about_user: Joi.string().required(),
    why_this_guild: Joi.string().required(),
})

export async function GET(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {

}

export async function POST(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();

    const { error } = applicationSchema.validate(data);
    if (error) {
        return NextResponse.json({ success: false, message: "Ошибка валидации", error: error.details }, { status: 400 });
    }

    const { about_user, why_this_guild } = data;

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: "Отсутствует заголовок авторизации"},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "POST",
            body: JSON.stringify({session_token: token}),
        })

        if ( !response.ok ){
            const errorData = await response.json()
            return NextResponse.json({success: false, message: "Не удалось получить данные о пользователе", error: errorData || response.statusText},{status: response.status})
        }

        const json = await response.json()
        if( !json.success ){
            return NextResponse.json({ success: false, message: json.message }, { status: 401 });
        }

        const user = json.profile;

        const [guildData] : any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if( !guildData ){
            return NextResponse.json({ success: false, message: 'Гильдия не найдена' },{status:404})
        }

        const [userGuild] : any = await query('SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?', [user.id, guildData.id])
        if ( userGuild ){
            return NextResponse.json({ success: false, message: 'Вы уже состоите в этой гильдии' },{status:409})
        }

        await query('INSERT INTO guilds_applications (fk_guild, fk_profile, about_user, why_this_guild) VALUES (?, ?, ?, ?)', [guildData.id, user.id, about_user, why_this_guild])
        return NextResponse.json({ success: true, message: "Заявка в гильдию отправлена" }, { status: 200 });
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}