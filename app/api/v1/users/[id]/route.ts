import { NextRequest, NextResponse } from "next/server";
import {permsQuery, query} from "@/lib/mysql";

export async function GET(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        let [profile] : any = await query('SELECT * FROM profiles WHERE id = ?', [id])

        if ( !profile ) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден' }, { status: 404 });
        }

        const [user] : any = await query('SELECT * FROM librepremium_data WHERE uuid = ?', [profile.fk_uuid])
        if ( !user ) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден, обратитесь к администратору площадки' }, { status: 404 });
        }
        const { premium_uuid, joined, last_seen } = user;

        let hasAdmin = false;
        const [adminPermission] : any = await permsQuery("SELECT * FROM `luckperms_user_permissions` WHERE uuid = ? AND (permission = 'group.staff' OR permission = 'group.dev');", [profile.fk_uuid])
        if ( adminPermission ){
            hasAdmin = true;
        }

        let hasFoxPlus = false;
        const [fplusPermission] : any = await permsQuery("SELECT * FROM `luckperms_user_permissions` WHERE uuid = ? AND permission = 'group.foxplus';", [profile.fk_uuid])
        if ( fplusPermission ){
            hasFoxPlus = true;
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
                hasAdmin,
                hasFoxPlus,
                inGuild
            },
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