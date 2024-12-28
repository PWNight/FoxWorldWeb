import { query } from '@/lib/mysql'; // Импортируем функцию для работы с MySQL
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let hasErrors = false;
    let errors = {
        action: '',
        old_value: '',
        new_value: '',
    };

    const data = await request.json();
    const action = data.action;
    const old_value = data.old_value;
    const new_value = data.new_value;

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

    if (hasErrors) {
        return NextResponse.json({ success: false, errors }, { status: 401 });
    } else {
        const response = await fetch("/api/v1/users/me",{
            method: "GET"
        })
        const json = await response.json()

        if(Object.keys(json).length == 0){
            return NextResponse.json({ success: false, data: json }, { status: 401 });
        }

        switch (action) {
            case 'change_nickname':
                const libre_user: any = await query('SELECT * FROM librepremium_data WHERE last_nickname = ?', [new_value]);
                if (libre_user.length != 0) {
                    return NextResponse.json({ success: false, message: 'Данный никнейм уже занят' }, { status: 403 });
                }

                await query('UPDATE `librepremium_data` SET last_nickname = ? WHERE last_nickname = ?', [new_value, old_value]);
                await query('UPDATE `profiles` SET nick = ? WHERE nick = ?', [new_value, old_value]);
                break;
            case 'change_password':
                break;
        }
    }
}