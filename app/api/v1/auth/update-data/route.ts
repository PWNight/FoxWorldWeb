import { query } from '@/lib/mysql';
import { rconQuery } from '@/lib/rcon'
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let hasErrors = false;
    let errors = {
        action: '',
        old_value: '',
        new_value: '',
        user_data: ''
    };

    const data = await request.json();
    const action = data.action;
    const old_value = data.old_value;
    const new_value = data.new_value;
    //TODO: Переписать небезопасное получение информации
    const user_data = data.user_data;

    if (action == null || action === '' || typeof action !== 'string') {
        hasErrors = true;
        if (action == null || action === '') {
            errors.action = 'Тип действия отсутствует';
        } else {
            if (typeof action !== 'string') {
                errors.action = 'Тип действия должен быть строкой';
            }
        }
    }
    if (old_value == null || old_value === '' || typeof old_value !== 'string') {
        hasErrors = true;
        if (old_value == null || old_value === '') {
            errors.old_value = 'Старое значение отсутствует';
        } else {
            if (typeof old_value !== 'string') {
                errors.old_value = 'Старое значение должно быть строкой';
            }
        }
    }

    if (new_value == null || new_value === '' || typeof new_value !== 'string') {
        hasErrors = true;
        if (new_value == null || new_value === '') {
            errors.new_value = 'Новое значение отсутствует';
        } else {
            if (typeof new_value !== 'string') {
                errors.new_value = 'Новое значение должно быть строкой';
            }
        }
    }

    if (user_data == null || typeof user_data !== "object") {
        hasErrors = true;
        if (user_data == null) {
            errors.user_data = 'Отсутствует информация об игроке';
        } else {
            if (typeof user_data !== 'object') {
                errors.user_data = 'Информация об игроке должна быть объектом';
            }
        }
    }

    if (old_value == new_value ) {
        return NextResponse.json({ success: false, message: 'Укажите новое значение' }, { status: 403 });
    }
    if (hasErrors) {
        return NextResponse.json({ success: false, errors }, { status: 401 });
    } else {
        //TODO: Переписать получение информации об игроке через API
        /*const response = await fetch("http://localhost:3000/api/v1/users/me",{
            method: "GET"
        })
        const json = await response.json()

        if(Object.keys(json).length == 0){
            return NextResponse.json({ success: false, message: "Не удалось получить данные сессии" }, { status: 401 });
        }
        if(!json.success){
            return NextResponse.json({ success: false, message: "Не удалось получить данные сессии" }, { status: 401 });
        }
        */
        switch (action) {
            case 'change_nickname':
                const libre_user: any = await query('SELECT * FROM librepremium_data WHERE last_nickname = ?', [new_value]);
                if (libre_user.length != 0) {
                    return NextResponse.json({ success: false, message: 'Данный никнейм уже занят' }, { status: 403 });
                }

                // TODO: Implement error handler
                await rconQuery(`librelogin user migrate ${old_value} ${new_value}`);

                await query('UPDATE `profiles` SET nick = ? WHERE nick = ?', [new_value, old_value]);
                return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
            case 'change_password':
                // TODO: Implement error handler
                await rconQuery(`librelogin user pass-change ${user_data.profile.nick} ${new_value}`);
                return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
        }
    }
}