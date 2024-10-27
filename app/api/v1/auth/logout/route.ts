import { decrypt, deleteSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = request.cookies.get('s_token')
    
    if(session === undefined){
        return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    const userData = await decrypt(session?.value)
    if(userData === null){
        return NextResponse.json({ error: 'Токен некорректен' }, { status: 422 })
    }
    await deleteSession()
    return NextResponse.json({ message: "Success" }, {status:200})
}