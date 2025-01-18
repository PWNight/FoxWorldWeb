import { createSession, encrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";

export async function POST(request: NextRequest) {

    const data = await request.json();
    const uuid = data.uuid;
    const last_nickname = data.last_nickname;

    const userSchema = Joi.object({
        uuid: Joi.string().required(),
        last_nickname: Joi.string().required(),
    })
    const { error } = userSchema.validate(data);

    if (error) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    } else {
        // Заносим UUID и Никнейм в сессию, остальную информация будет поступать из БД
        const expiresAt = new Date(Date.now() + 7  *  24  *  60  *  60  *  1000); // 7 дней
        const sessionToken = await encrypt({ data:{uuid,last_nickname}, expiresAt });

        await createSession(sessionToken, expiresAt)
        return NextResponse.json({ success: true }, { status: 200 });
    }
}