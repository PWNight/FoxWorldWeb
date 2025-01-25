import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function GET(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try{
        let [profile] : any = await query('SELECT * FROM profiles WHERE id = ?', [id])

        if ( !profile ) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден' }, { status: 404 });
        }

        const [user] : any = await query('SELECT * FROM librepremium_data WHERE uuid = ?', [profile.fk_uuid])
        const { premium_uuid, joined, last_seen } = user;

        return NextResponse.json({ success: true, user: {premium_uuid, joined, last_seen}, profile }, {status:200})
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}