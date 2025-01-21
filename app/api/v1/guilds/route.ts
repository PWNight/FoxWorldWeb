import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import Joi from "joi";

export async function GET(request: NextRequest) {
    try{
        let guildData:any = await query("SELECT * FROM guilds")
        return NextResponse.json({success: true, data: guildData}, {status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', error}, {status:500})
    }
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const url = data.url;
    const name = data.name;
    const description = data.description;
    const info = data.info;
    const session_token = data.session_token;

    const userSchema = Joi.object({
        session_token: Joi.required(),
        url: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        info: Joi.string().required(),
    })
    let { error } = userSchema.validate(data);

    if (error) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    }

    let response = await fetch("https://foxworld.ru/api/v1/users/me",{
        method: "POST",
        body: JSON.stringify({session_token}),
    })

    const json = await response.json()
    if(!json.success){
        return NextResponse.json({ success: false, message: "Не удалось получить данные сессии" }, { status: 401 });
    }
    const user = json.profile;

    try{
        if(user.in_guild){
            const userGuilds : any = await query('SELECT permission FROM guilds_members WHERE uid = ?', [user.id])
            if (userGuilds.length > 0 && userGuilds[0].permission == 2){
                return NextResponse.json({success: false, message: 'Вы уже являетесь главой одной из гильдий'},{status:401})
            }
        }

        const guildData : any = await query('SELECT * FROM guilds WHERE url = ?', [url])
        if(guildData.length != 0){
            return NextResponse.json({success: false, message: 'Гильдия с данной ссылкой уже существует'},{status:500})
        }

        await query('INSERT INTO guilds (owner_id, url, name, description, info) VALUES (?, ?, ?, ?, ?)', [user.id, url, name, description, info]);

        const guild : any = await query("SELECT id FROM guilds WHERE url = ?", [url])
        await query('INSERT INTO guilds_members (fk_guild, uid, permission) VALUES (?, ?, ?)', [guild[0].id, user.id, 2])
        await query('UPDATE profiles SET in_guild = 1 WHERE id = ?', [user.id])

        return NextResponse.json({success: true, message: 'Гильдия успешно создана'},{status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', error}, {status:500})
    }
}