import { query } from '@/lib/mysql'; // Импортируем функцию для работы с MySQL
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let hasErrors = false;
    let errors = {
        username: '',
        password: '',
    };

    const data = await request.json();
    const username = data.username;
    const password = data.password;

    if (username == null || username === '' || typeof username !== 'string') {
        hasErrors = true;
        if (username == null || username === '') {
            errors.username = 'Никнейм отсутствует';
        } else {
            if (typeof username !== 'string') {
                errors.username = 'Никнейм должен быть строкой';
            }
        }
    }
    if (password == null || password === '' || typeof password !== 'string') {
        hasErrors = true;
        if (password == null || password === '') {
            errors.password = 'Пароль отсутствует';
        } else {
            if (typeof password !== 'string') {
                errors.password = 'Пароль должен быть строкой';
            }
        }
    }

    if (hasErrors) {
        return NextResponse.json({ success: false, errors }, { status: 401 });
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