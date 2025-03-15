import {permsQuery, query} from "@/lib/mysql";
import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

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

        let hasAdmin = false;
        if ( profile.nick == 'PWNight'){
            hasAdmin = true;
        }
        /*const [adminPermission] : any = await permsQuery("SELECT * FROM `luckperms_user_permissions` WHERE uuid = ? AND (permission = 'group.staff' OR permission = 'group.dev');", [profile.fk_uuid])
        if ( adminPermission ){
            hasAdmin = true;
        }*/


        let hasFoxPlus = false;
        /*const [fplusPermission] : any = await permsQuery("SELECT * FROM `luckperms_user_permissions` WHERE uuid = ? AND permission = 'group.foxplus';", [profile.fk_uuid])
        if ( fplusPermission ){
            hasFoxPlus = true;
        }*/

        let hasAccess = false;
        const userApplications : any = await query("SELECT * FROM verify_applications WHERE nickname = ? AND status = ?", [profile.nick, 'Принята'])
        if ( userApplications.length > 0 ){
            hasAccess = true;
        }

        let inGuild = false;
        const userGuilds : any = await query("SELECT * FROM guilds_members WHERE uid = ?", [profile.id])
        if ( userGuilds.length > 0 ){
            inGuild = true;
        }

        return NextResponse.json({
            success: true,
            user: {premium_uuid, joined, last_seen},
            profile: {
                id: profile.id,
                nick: profile.nick,
                fk_uuid: profile.fk_uuid,
                hasAccess,
                hasAdmin,
                hasFoxPlus,
                inGuild
            },
            token
        }, {status:200})
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