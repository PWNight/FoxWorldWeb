import { query } from "@/lib/mysql";
import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";

async function checkToken(token: any){
    const data : any = await decrypt(token)

    if( data === null ){
        return NextResponse.json({ success: false, message: 'Токен некорректен' }, { status: 401 })
    }

    try{
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
    const session_token = request.cookies.get('s_token')
    if( session_token === undefined ){
        return NextResponse.json({ success: false, message: "Отсутсвует токен сессии в куки браузера" }, { status: 401 })
    }
    return await checkToken(session_token?.value)
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const session_token = data.token;

    const userSchema = Joi.object({
        session_token: Joi.string().required(),
    })

    const { error } = userSchema.validate(data);
    if ( error ) {
        return NextResponse.json({success: false, message: "Отсутствуют некоторые параметры", error}, {status: 401});
    }

    return await checkToken(session_token)
}