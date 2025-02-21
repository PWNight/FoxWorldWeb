import { query } from "@/lib/mysql";
import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

async function checkToken(token: any){
    const data : any = await decrypt(token)

    if( data === null ){
        return NextResponse.json({ success: false, message: 'Токен некорректен' }, { status: 401 })
    }

    try {
        const {uuid} = data.data;

        let [profile] : any = await query('SELECT * FROM profiles WHERE fk_uuid = ?', [uuid])
        if ( !profile ) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден, обратитесь к администратору площадки' }, { status: 404 });
        }

        const [user] : any = await query('SELECT * FROM librepremium_data WHERE uuid = ?', [profile.fk_uuid])
        if ( !user ) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден, обратитесь к администратору площадки' }, { status: 404 });
        }

        const { premium_uuid, joined, last_seen } = user;
        return NextResponse.json({ success: true, user: {premium_uuid, joined, last_seen}, profile, token }, {status:200})
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        const session_token = request.cookies.get('s_token')
        if( session_token === undefined ){
            return NextResponse.json({ success: false, message: "Отсутсвует заголовок авторизации" }, { status: 401 })
        }else{
            return await checkToken(session_token?.value)
        }
    }
    return await checkToken(authHeader.split(" ")[1])
}