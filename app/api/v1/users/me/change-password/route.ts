import { rconQuery } from '@/lib/rcon'
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const session_token = data.token;
    const new_password = data.new_password;

    const userSchema = Joi.object({
        session_token: Joi.string().required(),
        new_password: Joi.string().required(),
    })

    const { error } = userSchema.validate(data);
    if ( error ) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, {status: 401});
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

        if ( text.indexOf(new_password) >= 0 ){
            return NextResponse.json({ success: false, message: "Пароль небезопасен, выберите другой" }, { status: 401 });
        }

        await rconQuery(`librelogin user pass-change ${json.profile.nick} ${new_password}`);
        return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}