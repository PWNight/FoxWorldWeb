import { createSession, encrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const uuid = data.uuid;
    const username = data.username;

    const userSchema = Joi.object({
        uuid: Joi.string().required(),
        username: Joi.string().required(),
    })
    const { error } = userSchema.validate(data);

    if (error) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    }

    try {
        // Заносим UUID и Никнейм в сессию, остальную информация будет поступать из БД
        const expiresAt = new Date(Date.now() + 7  *  24  *  60  *  60  *  1000); // 7 дней

        const sessionToken = await encrypt({ data: { uuid, username}, expiresAt });

        await createSession(sessionToken, expiresAt)
        return NextResponse.json({ success: true }, { status: 200 });

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
