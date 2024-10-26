import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = request.cookies.get('s_token')
    
    if(session === undefined){
        return NextResponse.json({ data: null, message: "Unauthorized" }, { status: 200 })
    }
    const userData = await decrypt(session?.value)
    if(userData === null){
        return NextResponse.json({ error: 'Incorrect token' }, { status: 422 })
    }
    return NextResponse.json({data: userData}, { status: 200 })
}