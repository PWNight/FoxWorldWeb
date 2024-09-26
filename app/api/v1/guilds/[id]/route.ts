import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/mysql";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try{
        let [guildData]:any = await getData(`SELECT * FROM guilds WHERE id = '${params.id}'`)
        if(!guildData){
            return NextResponse.json({message:"Guild not found"}, {status:404});
        }
        return NextResponse.json({data: guildData}, {status:200})
    }catch (error: any){
        return NextResponse.json({status: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const data = await request.json()
    try{
        const guildData = await getData(`SELECT * FROM guilds WHERE id = '${params.id}'`)
        if(!guildData){
            return NextResponse.json({status: false, message: 'Guild not found'},{status:404})
        }else{
            //continue deleting
        }
    }catch (error: any){
        return NextResponse.json({status: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const data = await request.json()
    try{
        const guildData = await getData(`SELECT * FROM guilds WHERE id = '${params.id}'`)
        if(!guildData){
            return NextResponse.json({status: false, message: 'Guild not found'},{status:404})
        }else{
            //continue deleting
        }
    }catch (error: any){
        return NextResponse.json({status: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}