import { query } from '@/lib/mysql';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

        // Получение пользователя из базы данных
        if(user.in_guild){
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