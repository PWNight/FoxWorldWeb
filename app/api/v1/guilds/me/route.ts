import { query } from '@/lib/mysql';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let hasError = false;
    let error = ''

    const data = await request.json();
    const session_token = data.session_token;

    if (session_token == null || session_token === '' || typeof session_token !== 'string') {
        hasError = true;
        if (session_token == null || session_token === '') {
            error = 'Токен сессии отсутствует';
        } else {
            if (typeof session_token !== 'string') {
                error = 'Токен сессии должен быть строкой';
            }
        }
    }

    if (hasError) {
        return NextResponse.json({ success: false, message: "Ошибка валидации", error }, { status: 401 });
    }

    let response = await fetch("http://localhost:3000/api/v1/users/me",{
        method: "POST",
        body: JSON.stringify({session_token}),
    })

    const json = await response.json()
    if(!json.success){
        return NextResponse.json({ success: false, message: "Не удалось получить данные сессии" }, { status: 401 });
    }

    // Получение пользователя из базы данных
    if(json.profile.in_guild){
        const guild_user: any = await query('SELECT guilds.id, url, badge_url, name, description, info, is_recruit, discord_code, create_date, permission, member_since FROM guilds JOIN guilds_members ON guilds.id = guilds_members.fk_guild WHERE guilds_members.uid = ?', [json.profile.id]);
        return NextResponse.json({ success: true, data: guild_user[0] }, { status: 200 });
    }
    return NextResponse.json({ success: true, data: null }, { status: 200 });
}