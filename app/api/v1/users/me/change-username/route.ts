import { query } from '@/lib/mysql';
import { rconQuery } from '@/lib/rcon'
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import {getUserData} from "@/lib/utils";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const new_username = data.new_username;

    const userSchema = Joi.object({
        new_username: Joi.string().required(),
    })

    const { error } = userSchema.validate(data);
    if ( error ) {
        return NextResponse.json({success: false, message: "Отсутствуют некоторые параметры", error}, {status: 401});
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        const result = await getUserData(token);
        if ( !result.success ){
            return NextResponse.json(result, { status: result.status })
        }
        const user = result.data.profile;

        // Получение пользователя из базы данных
        const [libre_user] : any = await query('SELECT * FROM librepremium_data WHERE last_nickname = ?', [new_username]);
        if ( !libre_user ) {
            return NextResponse.json({ success: false, message: 'Данный никнейм уже занят' }, { status: 403 });
        }

        await rconQuery(`librelogin user migrate ${user.nick} ${new_username}`);

        await query('UPDATE `profiles` SET nick = ? WHERE nick = ?', [new_username, user.nick]);
        return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
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