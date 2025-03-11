import { query } from '@/lib/mysql';
import { NextRequest, NextResponse } from "next/server";
import {getUserData} from "@/lib/utils";

export async function GET(request: NextRequest) {
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

        // Получение пользователя из базы данных
        if(user.inGuild){
            const guilds_user: any = await query('SELECT *, profiles.nick AS owner_nickname, (SELECT COUNT(*) FROM guilds_members WHERE fk_guild = guilds.id) AS member_count, guilds_members.permission, guilds_members.member_since ' +
                'FROM guilds JOIN guilds_members ON guilds.id = guilds_members.fk_guild ' +
                'JOIN profiles ON guilds.owner_id = profiles.id ' +
                'WHERE guilds_members.uid = ?', [user.id]);
            return NextResponse.json({ success: true, data: guilds_user }, { status: 200 });
        }
        return NextResponse.json({ success: true, data: null }, { status: 200 });
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