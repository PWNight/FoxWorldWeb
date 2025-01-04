import { query } from '@/lib/mysql';
import { rconQuery } from '@/lib/rcon'
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let hasErrors = false;
    let errors = {
        session_token: '',
        new_username: '',
    };

    const data = await request.json();
    const session_token = data.session_token;
    const new_username = data.new_username;

    if (session_token == null || session_token === '' || typeof session_token !== 'string') {
        hasErrors = true;
        if (session_token == null || session_token === '') {
            errors.session_token = 'Токен сессии отсутствует';
        } else {
            if (typeof session_token !== 'string') {
                errors.session_token = 'Токен сессии должен быть строкой';
            }
        }
    }

    if (new_username == null || new_username === '' || typeof new_username !== 'string') {
        hasErrors = true;
        if (new_username == null || new_username === '') {
            errors.new_username = 'Новый никнейм отсутствует';
        } else {
            if (typeof new_username !== 'string') {
                errors.new_username = 'Новый никнейм должен быть строкой';
            }
        }
    }

    if (hasErrors) {
        return NextResponse.json({ success: false, message: "Ошибка валидации", errors }, { status: 401 });
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
    const libre_user: any = await query('SELECT * FROM librepremium_data WHERE last_nickname = ?', [new_username]);
    if (libre_user.length != 0) {
        return NextResponse.json({ success: false, message: 'Данный никнейм уже занят' }, { status: 403 });
    }

    await rconQuery(`librelogin user migrate ${json.profile.nick} ${new_username}`);

    await query('UPDATE `profiles` SET nick = ? WHERE nick = ?', [new_username,json.profile.nick]);
    return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
}