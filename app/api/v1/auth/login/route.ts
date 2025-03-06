import { query } from '@/lib/mysql'; // Импортируем функцию для работы с MySQL
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";
import Joi from 'joi';

export async function POST(request: NextRequest) {
    const data = await request.json();
    const username = data.username;
    const password = data.password;

    const userSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
    const { error } = userSchema.validate(data);

    if ( error ) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    }

    try {
        // Получение пользователя из базы данных
        const [user] : any = await query('SELECT * FROM librepremium_data WHERE last_nickname = ?', [username]);
        if ( !user ) {
            return NextResponse.json({ success: false, message: 'Неправильный никнейм или пароль' }, { status: 401 });
        }

        // Сравнение паролей пользователя
        const rightSalt = `$2a$10$${user.salt}`;
        let hashedPassword = await bcrypt.hash(password, rightSalt);
        hashedPassword = hashedPassword.replace('$2a$','').replace(user.salt,'')

        if( user.hashed_password !== hashedPassword ){
            return NextResponse.json({ success: false, message: "Неправильный никнейм или пароль" }, { status: 401 });
        }

        // Получение пользователя из базы данных
        const {uuid, last_nickname} = user;
        let [profile] : any = await query('SELECT * FROM profiles WHERE fk_uuid = ?', [uuid]);

        // Совместимость со сценарием, когда аккаунт зарегистрирован в игре
        if ( !profile ) {
            await query('INSERT INTO profiles (nick, fk_uuid) VALUES (?, ?)', [last_nickname, uuid])
        }
        return NextResponse.json({ success: true, data: { uuid, last_nickname } }, { status: 200 });
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