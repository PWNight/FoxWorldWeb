import { query } from "@/lib/mysql";
import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

async function checkToken(token: any){
    const data:any = await decrypt(token)
    if(data === null){
        return NextResponse.json({ success: false, error: 'Токен некорректен' }, { status: 401 })
    }

    try{
        const {uuid} = data.data;
        let profiles : any = await query('SELECT * FROM profiles WHERE fk_uuid = ?', [uuid])

        if (profiles.length === 0) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден, обратитесь к администратору площадки' }, { status: 404 });
        }
        const profile = profiles[0];

        const users : any = await query('SELECT * FROM librepremium_data WHERE uuid = ?', [profile.fk_uuid])
        const user = users[0];
        const { premium_uuid, joined, last_seen } = user;

        return NextResponse.json({success: true, user: {premium_uuid, joined, last_seen}, profile }, {status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}

export async function GET(request: NextRequest) {
    const session_token = request.cookies.get('s_token')
    if(session_token === undefined){
        return NextResponse.json({success: false, message: "Отсутсвует токен сессии в куки браузера"}, { status: 200 })
    }

    return await checkToken(session_token?.value)
}
export async function POST(request: NextRequest) {
    const data:any = await request.json()
    const session_token = data.session_token

    let hasErrors = false;
    let error = ''

    if (session_token == null || session_token === '' || typeof session_token !== 'string') {
        hasErrors = true;
        if (session_token == null || session_token === '') {
            error = 'Токен сессии отсутствует';
        } else {
            if (typeof session_token !== 'string') {
                error = 'Токен сессии должен быть строкой';
            }
        }
    }

    if (hasErrors) {
        return NextResponse.json({ success: false, error }, { status: 401 });
    }

    return await checkToken(session_token)
}