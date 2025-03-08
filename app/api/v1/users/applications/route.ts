import {NextRequest, NextResponse} from "next/server";
import Joi from "joi";
import {query} from "@/lib/mysql";
import {rconQuery} from "@/lib/rcon";

const applicationSchema = Joi.object({
    nickname: Joi.string().required(),
    age: Joi.number().required(),
    about: Joi.string().required(),
    where_find: Joi.string().required(),
    plans: Joi.string().required(),
})

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`}
        })

        if ( !response.ok ){
            const errorData = await response.json()
            return NextResponse.json({success: false, message: 'Не удалось получить данные о пользователе', error: errorData || response.statusText},{status: response.status})
        }

        const json = await response.json()

        if ( !['dev','staff'].includes(json.group) ){
            return NextResponse.json({ success: false, message: "Данный функционал доступен только команде разработки" }, { status: 401 });
        }

        const verifyApplications : any = await query(`SELECT * FROM verify_applications WHERE status = 'Рассматривается'`)
        return NextResponse.json({ success: true, data: verifyApplications }, { status: 200 });
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

export async function POST(request: NextRequest) {
    const data = await request.json();
    const { application_id, status, nickname } = data;
    if ( !application_id || !status || !nickname ) {
        return NextResponse.json({ success: false, message: 'Ошибка валидации' }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`}
        })

        if ( !response.ok ){
            const errorData = await response.json()
            return NextResponse.json({success: false, message: 'Не удалось получить данные о пользователе', error: errorData || response.statusText},{status: response.status})
        }

        const json = await response.json()
        const user = json.profile;

        if ( !['dev','staff'].includes(json.group) ){
            return NextResponse.json({ success: false, message: "Данный функционал доступен только команде разработки" }, { status: 401 });
        }

        const [verifyApplication] : any = await query('SELECT * FROM verify_applications WHERE id = ?',[application_id])
        if ( !verifyApplication ){
            return NextResponse.json({ success: false, message: 'Заявка не найдена' },{status: 400})
        }

        await query('UPDATE verify_applications SET status = ?, staff_uid = ? WHERE id = ?',[status, user.id, application_id])

        if ( status == 'Принята' ) {
            await query('UPDATE profiles SET has_access = 1 WHERE nick = ?', [nickname])
            await rconQuery(`easywl add ${nickname}`)
        }

        return NextResponse.json({ success: true, message: 'Заявка успешно обновлена' }, { status: 200 });
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

export async function PUT(request: NextRequest) {
    const data = await request.json();

    const { error } = applicationSchema.validate(data);
    if (error) {
        return NextResponse.json({ success: false, message: 'Ошибка валидации', error: error.details }, { status: 400 });
    }

    const { nickname, age, about, where_find, plans } = data;

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        let response = await fetch(`https://foxworld.ru/api/v1/users/me`,{
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`}
        })

        if ( !response.ok ){
            const errorData = await response.json()
            return NextResponse.json({success: false, message: 'Не удалось получить данные о пользователе', error: errorData || response.statusText},{status: response.status})
        }

        const [verifyApplication] : any = await query("SELECT * FROM verify_applications WHERE nickname = ? AND status = 'Рассматривается'", [nickname])
        if ( verifyApplication ){
            return NextResponse.json({ success: false, message: "Нельзя создать новую заявку, пока старая не рассмотрена" }, { status: 400 });
        }

        await query('INSERT INTO verify_applications (nickname, age, about, where_find, plans) VALUES (?, ?, ?, ?, ?)', [nickname, age, about, where_find, plans])
        return NextResponse.json({ success: true, message: 'Заявка на верификацию отправлена' }, { status: 200 });
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