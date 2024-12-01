import { createSession, encrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let hasErrors = false;
    let errors = {
        uuid: '',
        last_nickname: '',
    };

    const data = await request.json();
    const uuid = data.uuid;
    const last_nickname = data.last_nickname;

    if (uuid == null || uuid === '' || typeof uuid !== 'string') {
        hasErrors = true;
        if (uuid == null || uuid === '') {
            errors.uuid = 'UUID отсутствует';
        } else {
            if (typeof uuid !== 'string') {
                errors.uuid = 'UUID должен быть строкой';
            }
        }
    }
    if (last_nickname == null || last_nickname === '' || typeof last_nickname !== 'string') {
        hasErrors = true;
        if (last_nickname == null || last_nickname === '') {
            errors.last_nickname = 'Никнейм отсутствует';
        } else {
            if (typeof last_nickname !== 'string') {
                errors.last_nickname = 'Никнейм должен быть строкой';
            }
        }
    }

    if (hasErrors) {
        return NextResponse.json({ success: false, errors }, { status: 401 });
    } else {
        // Заносим UUID и Никнейм в сессию, остальную информация будет поступать из БД
        const expiresAt = new Date(Date.now() + 7  *  24  *  60  *  60  *  1000); // 7 дней
        const sessionToken = await encrypt({ data:{uuid,last_nickname}, expiresAt });

        await createSession(sessionToken, expiresAt)
        return NextResponse.json({ success: true }, { status: 200 });
    }
}