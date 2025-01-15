import { rconQuery } from '@/lib/rcon'
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let hasErrors = false;
    let errors = {
        session_token: '',
        new_password: '',
    };

    const data = await request.json();
    const session_token = data.session_token;
    const new_password = data.new_password;

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

    if (new_password == null || new_password === '' || typeof new_password !== 'string') {
        hasErrors = true;
        if (new_password == null || new_password === '') {
            errors.new_password = 'Новый пароль отсутствует';
        } else {
            if (typeof new_password !== 'string') {
                errors.new_password = 'Новый пароль должен быть строкой';
            }
        }
    }

    if (hasErrors) {
        return NextResponse.json({ success: false, message: "Ошибка валидации", errors }, { status: 401 });
    }

    let response = await fetch("https://foxworld.ru/api/v1/users/me",{
        method: "POST",
        body: JSON.stringify({session_token}),
    })

    const json = await response.json()
    if(!json.success){
        return NextResponse.json({ success: false, message: "Не удалось получить данные сессии" }, { status: 401 });
    }

    const nickname = json.profile.nick;
    const result = await fetch('https://foxworld.ru/api/v1/auth/login',{
        method: 'POST',
        body: JSON.stringify({username:nickname,password:new_password}),
    })
    if(result.ok){
        return NextResponse.json({ success: false, message: "Новый пароль совпадает с текущим" }, { status: 401 });
    }

    response = await fetch("https://foxworld.ru/forbidden-passwords.txt",{
        method: "GET",
    })
    let text = await response.text()

    if (text.indexOf(new_password) >= 0){
        return NextResponse.json({ success: false, message: "Пароль небезопасен, выберите другой" }, { status: 401 });
    }

    await rconQuery(`librelogin user pass-change ${json.profile.nick} ${new_password}`);
    return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
}