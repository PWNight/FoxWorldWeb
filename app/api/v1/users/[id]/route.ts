import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function GET(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try{
        let profiles : any = await query('SELECT * FROM profiles WHERE id = ?', [id])

        if (profiles.length === 0) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден' }, { status: 404 });
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