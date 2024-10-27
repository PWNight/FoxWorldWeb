import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = request.cookies.get('s_token')
    
    if(session === undefined){
        return NextResponse.json({ data: null, message: "Не авторизован" }, { status: 200 })
    }
    const data = await decrypt(session?.value)
    if(data === null){
        return NextResponse.json({ error: 'Токен некорректен' }, { status: 422 })
    }
    return NextResponse.json({success: true, data}, { status: 200 })
}