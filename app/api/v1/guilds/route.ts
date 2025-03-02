import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import Joi from "joi";

export async function GET(request: NextRequest) {
    try{
        let guilds : any = await query("SELECT *, profiles.nick AS owner_nickname, (SELECT COUNT(*) FROM guilds_members WHERE fk_guild = guilds.id) AS member_count FROM guilds JOIN profiles ON guilds.owner_id = profiles.id");
        return NextResponse.json({ success: true, data: guilds }, {status:200})
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    const url = data.url;
    const name = data.name;
    const description = data.description;
    const info = data.info;

    const userSchema = Joi.object({
        url: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        info: Joi.string().required(),
    })
    let { error } = userSchema.validate(data);

    if (error) {
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

        if(user.in_guild){
            const userGuilds : any = await query('SELECT permission FROM guilds_members WHERE uid = ?', [user.id])
            if ( userGuilds.length > 0 ){
                userGuilds.map((guild: any) => {
                    if ( guild.permission == 2 ) {
                        return NextResponse.json({ success: false, message: 'Вы уже являетесь главой одной из гильдий' },{status:401})
                    }
                })}
        }

        let [guildData] : any = await query('SELECT * FROM guilds WHERE url = ?', [url])
        if( guildData ){
            return NextResponse.json({ success: false, message: 'Гильдия с данной ссылкой уже существует' },{status:500})
        }

        await query('INSERT INTO guilds (owner_id, url, name, description, info) VALUES (?, ?, ?, ?, ?)', [user.id, url, name, description, info]);

        let [guild] : any = await query("SELECT id FROM guilds WHERE url = ?", [url])

        await query('INSERT INTO guilds_members (fk_guild, uid, permission) VALUES (?, ?, ?)', [guild.id, user.id, 2])
        await query('UPDATE profiles SET in_guild = 1 WHERE id = ?', [user.id])

        return NextResponse.json({success: true, message: 'Гильдия успешно создана'},{status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', error}, {status:500})
    }
}