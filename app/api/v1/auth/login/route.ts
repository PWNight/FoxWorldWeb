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
        password: Joi.string().required().pattern(/^[a-zA-Z0-9]+$/),
    })
    const { error } = userSchema.validate(data);

    if (error) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    } else {
        // Получение пользователя из базы данных
        const sql = 'SELECT * FROM librepremium_data WHERE last_nickname = ?';
        const users: any = await query(sql, [username]);

        if (users.length === 0) {
            return NextResponse.json({ success: false, message: 'Неправильный никнейм или пароль' }, { status: 401 });
        }

        const user = users[0];

        const rightSalt = `$2a$10$${user.salt}`;

        let hashedPassword = await bcrypt.hash(password, rightSalt);
        hashedPassword = hashedPassword.replace('$2a$','').replace(user.salt,'')
        
        if(user.hashed_password !== hashedPassword){
            return NextResponse.json({ success: false, message: "Неправильный никнейм или пароль" }, { status: 401 });
        }else{
            const {uuid, last_nickname} = user;

            // Получение пользователя из базы данных
            const sql = 'SELECT * FROM profiles WHERE fk_uuid = ?';
            let profiles: any = await query(sql, [uuid]);

            // Совместимость со сценарием, когда аккаунт зарегистрирован в игре
            if (profiles.length === 0) {
                const sql = 'INSERT INTO profiles (nick, fk_uuid) VALUES (?, ?)'
                await query(sql, [last_nickname, uuid])
            }
            return NextResponse.json({ success: true, data: { uuid, last_nickname } }, { status: 200 });
        }
    }
}