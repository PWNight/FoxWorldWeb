import { NextRequest, NextResponse } from "next/server";
import {minecraftQuery, permsQuery, query} from "@/lib/mysql";
const botToken = process.env.BOT_TOKEN


export async function GET(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        let [profile] : any = await query('SELECT * FROM profiles WHERE id = ?', [id])

        if ( !profile ) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден' }, { status: 404 });
        }

        const [user] : any = await query('SELECT * FROM librepremium_data WHERE uuid = ?', [profile.fk_uuid])
        if ( !user ) {
            return NextResponse.json({ success: false, message: 'Пользователь не найден, обратитесь к администратору площадки' }, { status: 404 });
        }
        const { premium_uuid, joined, last_seen } = user;

        const [group] : any = await permsQuery("SELECT primary_group FROM luckperms_players WHERE username = ?", [profile.nick])
        const [discord] : any = await minecraftQuery("SELECT discord FROM ds_accounts WHERE uuid = ?", [profile.fk_uuid]);


        const res = await fetch(`https://discord.com/api/guilds/921483461016031263/members/${discord.discord}`, {
            headers: {
                "Authorization": `Bot ${botToken}`
            }
        })
        const json = await res.json()

        if (!res.ok) {
            return NextResponse.json({ success: false, message: json.message }, {status:500})
        }

        return NextResponse.json({ success: true, user: {premium_uuid, joined, last_seen}, profile, group: group.primary_group, discord: json }, {status:200})
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}