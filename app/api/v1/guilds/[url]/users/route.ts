import {NextRequest, NextResponse} from "next/server";
import { query } from "@/lib/mysql";
import Joi from "joi";

export async function GET(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    try {
        let guildUsers : any = await query(`SELECT uid, profiles.nick AS nickname, permission, member_since FROM guilds_members 
            JOIN profiles ON guilds_members.uid = profiles.id 
            JOIN guilds ON guilds_members.fk_guild = guilds.id 
            WHERE guilds.url = ?`,
        [url])
        if( guildUsers.length == 0 ){
            return NextResponse.json({ success: false, message: "Пользователи гильдии не найдены" }, {status:404});
        }
        return NextResponse.json({ success: true, data: guildUsers }, {status:200})
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}
export async function PUT(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();
    const session_token = data.session_token;
    const user_id = data.user_id;
    const permission = data.permission;

    const userSchema = Joi.object({
        session_token: Joi.required(),
        user_id: Joi.required(),
        permission: Joi.required()
    })
    const { error } = userSchema.validate(data);

    if ( error ) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    }

    try {
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "POST",
            body: JSON.stringify({session_token}),
        })

        const json = await response.json()
        if(!json.success){
            return NextResponse.json({ success: false, message: "Не удалось получить данные сессии" }, { status: 401 });
        }
        const user = json.profile;

        if( !user.in_guild ){
            return NextResponse.json({success: false, message: 'Вы не состоите в гильдии'},{status:401})
        }

        const [guildData] : any = await query('SELECT * FROM guilds WHERE url = ?', [url])
        if( !guildData ){
            return NextResponse.json({success: false, message: 'Гильдия не найдена'},{status:404})
        }

        const [userPermission] : any = await query('SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild', [user.id, guildData.id])
        if ( !userPermission || userPermission.permission != 2 ){
            return NextResponse.json({success: false, message: 'У вас нету доступа к этой гильдии'},{status:401})
        }

        if( permission == 2 ){
            await query("UPDATE guilds_members SET permission = 0 WHERE uid = ?", [user.id])
            await query("UPDATE guilds_members SET permission = 2 WHERE uid = ?",[user_id])
            await query("UPDATE guilds SET owner_id = ? WHERE owner_id = ?", [user_id, guildData.owner_id])
            return NextResponse.json({success: true, message: 'Гильдия успешно передана новому главе'},{status:401})
        }

        await query("INSERT INTO guilds_members (fk_guild, uid, permission) VALUES (?, ?, ?)", [guildData.id, user_id, permission])

        await query('UPDATE profiles SET in_guild = 1 WHERE id = ?', [user_id])

        return NextResponse.json({ success: true, message: "Игрок успешно добавлен в гильдию" }, { status: 200 });
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', error}, {status:500})
    }
}
export async function POST(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();
    const session_token = data.session_token;
    const user_id = data.user_id;
    const permission = data.permission;

    const userSchema = Joi.object({
        session_token: Joi.required(),
        user_id: Joi.required(),
        permission: Joi.required()
    })
    const { error } = userSchema.validate(data);

    if ( error ) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    }

    let response = await fetch("https://foxworld.ru/api/v1/users/me",{
        method: "POST",
        body: JSON.stringify({session_token}),
    })

    const json = await response.json()
    if( !json.success ){
        return NextResponse.json({ success: false, message: "Не удалось получить данные сессии" }, { status: 401 });
    }
    const user = json.profile;

    try{
        if( !user.in_guild ){
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
            await query("UPDATE guilds_members SET permission = 2 WHERE uid = ?",[user_id])
            await query("UPDATE guilds SET owner_id = ? WHERE owner_id = ?", [user_id, guildData.owner_id])
            return NextResponse.json({success: true, message: 'Гильдия успешно передана новому главе'},{status:401})
        }

        await query("UPDATE guilds_members SET permission = ? WHERE uid = ?", [permission, user_id])
        await query('UPDATE profiles SET in_guild = 1 WHERE id = ?', [user_id])

        return NextResponse.json({ success: true, message: "Уровень доступа игрока обновлён" }, { status: 200 });
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', error}, {status:500})
    }
}
export async function DELETE(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();
    const session_token = data.session_token;
    const user_id = data.user_id;

    const userSchema = Joi.object({
        session_token: Joi.required(),
        user_id: Joi.required()
    })
    const { error } = userSchema.validate(data);

    if ( error ) {
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
        const [guildData] : any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if( !guildData ){
            return NextResponse.json({success: false, message: 'Гильдия не найдена'},{status:404})
        }

        if( !user.in_guild ){
            return NextResponse.json({success: false, message: 'Вы не состоите в гильдии'},{status:401})
        }

        const [userGuilds] : any = await query('SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?', [user.id, guildData.id])
        if ( !userGuilds || userGuilds.permission != 2 ){
            return NextResponse.json({success: false, message: 'У вас нету доступа к этой гильдии'},{status:401})
        }

        await query("DELETE FROM guilds_members WHERE fk_guild = ? AND uid = ?", [guildData.id, user_id])
        await query('UPDATE profiles SET in_guild = 0 WHERE id = ?', [user_id])

        return NextResponse.json({success: true, message: 'Участник исключён из гильдии'},{status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', error}, {status:500})
    }
}