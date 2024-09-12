import { NextRequest, NextResponse } from "next/server";
import connection from "@/lib/mysql";
import internal from "stream";
import { removeRequestMeta } from "next/dist/server/request-meta";
interface GuildData {
    id: number;
    other_fields: string | undefined;
}

export async function GET(request: NextRequest) {
    try{
        let [guildData] = await connection.promise().query(`SELECT * FROM guilds`)
        return NextResponse.json({data: guildData}, {status:200})
    }catch (error: any){
        return NextResponse.json({status: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}
export async function POST(request: NextRequest) {
    const params = await request.json()
    try{
        let [result]:any = await connection.promise().query(`SELECT * FROM guilds WHERE name = ${params.name}`)
        const guildData:any = result[0]
        if(guildData){
            return NextResponse.json({status: false, message: 'Guild already exists'},{status:500})
        }else{
            //continue create process
            return NextResponse.json({status: true, message: 'OK'},{status:200})
        }
    }catch (error: any){
        return NextResponse.json({status: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}