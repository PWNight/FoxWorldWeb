import { NextRequest, NextResponse } from "next/server";
import connection from "@/lib/mysql";

export async function GET(request: NextRequest) {
    try{
        let [guildData] = await connection.promise().query(`SELECT * FROM guilds`)
        return NextResponse.json({data: guildData}, {status:200})
    }catch (error: any){
        return NextResponse.json({status: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}