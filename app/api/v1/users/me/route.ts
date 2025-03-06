import {minecraftQuery, permsQuery, query} from "@/lib/mysql";
import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
const botToken = process.env.BOT_TOKEN

async function checkToken(token: any){
    const data : any = await decrypt(token)

    if( data === null ){
        return NextResponse.json({ success: false, message: 'Токен некорректен' }, { status: 401 })
    }

    try {
        const {uuid} = data.data;

        let [profile] : any = await query('SELECT * FROM profiles WHERE fk_uuid = ?', [uuid])
        if ( !profile ) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден, обратитесь к администратору площадки' }, { status: 404 });
        }

        const [user] : any = await query('SELECT * FROM librepremium_data WHERE uuid = ?', [profile.fk_uuid])
        if ( !user ) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден, обратитесь к администратору площадки' }, { status: 404 });
        }
        const { premium_uuid, joined, last_seen } = user;

        const [group] : any = await permsQuery("SELECT primary_group FROM luckperms_players WHERE username = ?", [profile.nick])
        const [discord] : any = await minecraftQuery("SELECT discord FROM ds_accounts WHERE uuid = ?", [profile.fk_uuid]);


        const res = await fetch(`https://discord.com/api/guilds/921483461016031263/members/${discord.discord}`, {
            headers: {
                "Authorization": `Bot ${botToken}`
            }
        })
        const json = await res.json()

        if (!res.ok) {
            return NextResponse.json({ success: false, message: json.message }, {status:500})
        }

        return NextResponse.json({ success: true, user: {premium_uuid, joined, last_seen}, profile, group: group.primary_group, discord: json, token }, {status:200})
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

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            const session_token = request.cookies.get('s_token')
            if( session_token === undefined ){
                return NextResponse.json({ success: false, message: "Отсутсвует заголовок авторизации" }, { status: 401 })
            }

            return await checkToken(session_token?.value)
        }
        return await checkToken(authHeader.split(" ")[1])
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