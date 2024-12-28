import { query } from "@/lib/mysql";
import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = request.cookies.get('s_token')
    
    if(session === undefined){
        return NextResponse.json({}, { status: 200 })
    }

    const data:any = await decrypt(session?.value)
    if(data === null){
        return NextResponse.json({ error: 'Токен некорректен' }, { status: 401 })
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

        return NextResponse.json({user: {premium_uuid, joined, last_seen}, profile }, {status:200})
    }catch (error: any){
        return NextResponse.json({status: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}