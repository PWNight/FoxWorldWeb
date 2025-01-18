import {NextRequest, NextResponse} from "next/server";
import { query } from "@/lib/mysql";
import Joi from "joi";

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
            //continue changing
        }
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}
export async function DELETE(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();
    const user_id = data.user_id;

    const userSchema = Joi.object({
        user_id: Joi.required(),
    })
    const { error } = userSchema.validate(data);

    if (error){
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    }
    try{
        const guildData : any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if(!guildData){
            return NextResponse.json({success: false, message: 'Гильдия не найдена'},{status:404})
        }

        const userGuilds : any = await query('SELECT permission FROM guilds_members WHERE fk_guild = ? AND uid = ?', [guildData[0].id, user_id])
        if (userGuilds.length == 0){
            return NextResponse.json({success: false, message: 'Вы не состоите в этой гильдии'},{status:401})
        }
        if (userGuilds[0].permission != 2){
            return NextResponse.json({success: false, message: 'Вы не глава этой гильдии'},{status:401})
        }

        await query("DELETE * FROM guilds WHERE id = ?", [guildData[0].id])
        await query("DELETE * FROM guilds_members WHERE fk_guild = ?", [guildData[0].id])

        return NextResponse.json({success: true, message: 'Гильдия удалена'},{status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}