import {NextRequest, NextResponse} from "next/server";
import { query } from "@/lib/mysql";

export async function GET(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    try{
        let guildData:any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if(guildData.length == 0){
            return NextResponse.json({success: false, message: "Гильдия не найдена"}, {status:404});
        }
        return NextResponse.json({success: true, data: guildData}, {status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}
export async function POST(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    try{
        const guildData:any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if(!guildData){
            return NextResponse.json({success: false, message: 'Гильдия не найдена'},{status:404})
        }else{
            //continue deleting
        }
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}
export async function DELETE(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    try{
        const guildData = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if(!guildData){
            return NextResponse.json({success: false, message: 'Гильдия не найдена'},{status:404})
        }else{
            //continue deleting
        }
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}