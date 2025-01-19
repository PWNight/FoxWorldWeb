import {NextRequest, NextResponse} from "next/server";
import { query } from "@/lib/mysql";
import Joi from "joi";

export async function GET(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    try{
        let guildData:any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if(guildData.length == 0){
            return NextResponse.json({success: false, message: "Гильдия не найдена"}, {status:404});
        }
        return NextResponse.json({success: true, data: guildData}, {status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}
export async function POST(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();
    const session_token = data.session_token;
    const guild_data = data.guild_data;

    const userSchema = Joi.object({
        session_token: Joi.required(),
        guild_data: Joi.string().required(),
    })
    const { error } = userSchema.validate(data);

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
        if(!user.in_guild){
            return NextResponse.json({success: false, message: 'Вы не состоите в гильдии'},{status:401})
        }
        const userGuilds : any = await query('SELECT permission FROM guilds_members WHERE uid = ?', [user.id])
        if (userGuilds.length == 0 || userGuilds[0].permission != 2){
            return NextResponse.json({success: false, message: 'У вас нету доступа к этой гильдии'},{status:401})
        }

        const guildData:any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if(guildData.length == 0){
            return NextResponse.json({success: false, message: 'Гильдия не найдена'},{status:404})
        }else{
            guild_data.map(async(item:any) => {
                await query("UPDATE guilds SET ? = ? WHERE url = ?", [item.name, item.value, url])
            })
            return NextResponse.json({ success: true, message: "Информация о гильдии успешно обновлена" }, { status: 200 });
        }
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}
export async function DELETE(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();
    const session_token = data.session_token;

    const userSchema = Joi.object({
        session_token: Joi.required(),
    })
    const { error } = userSchema.validate(data);

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
        const guildData : any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if(guildData.length == 0){
            return NextResponse.json({success: false, message: 'Гильдия не найдена'},{status:404})
        }

        if(!user.in_guild){
            return NextResponse.json({success: false, message: 'Вы не состоите в гильдии'},{status:401})
        }
        const userGuilds : any = await query('SELECT permission FROM guilds_members WHERE uid = ?', [user.id])
        if (userGuilds.length == 0 || userGuilds[0].permission != 2){
            return NextResponse.json({success: false, message: 'У вас нету доступа к этой гильдии'},{status:401})
        }

        await query("DELETE * FROM guilds WHERE id = ?", [guildData[0].id])
        await query("DELETE * FROM guilds_members WHERE fk_guild = ?", [guildData[0].id])
        await query('UPDATE profiles SET in_guild = 0 WHERE id = ?', [user.id])

        return NextResponse.json({success: true, message: 'Гильдия успешно удалена'},{status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}