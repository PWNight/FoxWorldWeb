import {NextRequest, NextResponse} from "next/server";
import {query} from "@/lib/mysql";

export async function GET(request: NextRequest, {params}: { params: Promise<{ url: string, id: number }> }) {
    const {url, id} = await params;
    try {
        let [guildUsers] : any = await query(`SELECT profiles.nick AS nickname, permission, member_since FROM guilds_members 
            JOIN profiles ON guilds_members.uid = profiles.id 
            JOIN guilds ON guilds_members.fk_guild = guilds.id 
            WHERE guilds.url = ? AND guilds_members.uid = ?`,
        [url, id])
        if(guildUsers.length == 0){
            return NextResponse.json({success: false, message: "Пользователь или гильдия не найдены"}, {status:404});
        }
        return NextResponse.json({success: true, data: guildUsers}, {status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', error}, {status:500})
    }
}