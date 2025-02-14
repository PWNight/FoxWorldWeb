import { query } from '@/lib/mysql';
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const session_token = data.session_token;

    const userSchema = Joi.object({
        session_token: Joi.required(),
    })

    const { error } = userSchema.validate(data);
    if (error) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
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
        const user = json.profile;

        // Получение пользователя из базы данных
        if(user.in_guild){
            const guilds_user: any = await query('SELECT *, profiles.nick AS owner_nickname, (SELECT COUNT(*) FROM guilds_members WHERE fk_guild = guilds.id) AS member_count, guilds_members.permission, guilds_members.member_since ' +
                'FROM guilds JOIN guilds_members ON guilds.id = guilds_members.fk_guild ' +
                'JOIN profiles ON guilds.owner_id = profiles.id ' +
                'WHERE guilds_members.uid = ?', [user.id]);
            return NextResponse.json({ success: true, data: guilds_user }, { status: 200 });
        }
        return NextResponse.json({ success: true, data: null }, { status: 200 });
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', error}, {status:500})
    }
}