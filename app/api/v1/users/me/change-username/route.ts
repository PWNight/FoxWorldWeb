import { query } from '@/lib/mysql';
import { rconQuery } from '@/lib/rcon'
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const session_token = data.session_token;
    const new_username = data.new_username;

    const userSchema = Joi.object({
        session_token: Joi.string().required(),
        new_username: Joi.string().required(),
    })

    const { error } = userSchema.validate(data);
    if ( error ) {
        return NextResponse.json({success: false, message: "Отсутствуют некоторые параметры", error}, {status: 401});
    }

    try {
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "POST",
            body: JSON.stringify({session_token}),
        })
        const json = await response.json()
        if( !json.success ){
            return NextResponse.json({ success: false, message: "Не удалось получить данные сессии" }, { status: 401 });
        }
        // Получение пользователя из базы данных
        const [libre_user] : any = await query('SELECT * FROM librepremium_data WHERE last_nickname = ?', [new_username]);
        if ( !libre_user ) {
            return NextResponse.json({ success: false, message: 'Данный никнейм уже занят' }, { status: 403 });
        }

        await rconQuery(`librelogin user migrate ${json.profile.nick} ${new_username}`);

        await query('UPDATE `profiles` SET nick = ? WHERE nick = ?', [new_username,json.profile.nick]);
        return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}