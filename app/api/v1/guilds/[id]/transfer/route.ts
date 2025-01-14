import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function POST(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try{
        let [guildData]:any = await query(`SELECT * FROM guilds WHERE id = ?`,[id])
        if(!guildData){
            return NextResponse.json({message:"Guild not found"}, {status:404});
        }
        return NextResponse.json({data: guildData}, {status:200})
    }catch (error: any){
        return NextResponse.json({status: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}