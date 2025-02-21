import {NextRequest, NextResponse} from "next/server";
import { query } from "@/lib/mysql";
import Joi from "joi";

export async function GET(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    try{
        let [guildData] :any = await query(`SELECT *, profiles.nick AS owner_nickname, (SELECT COUNT(*) FROM guilds_members WHERE fk_guild = guilds.id) AS member_count FROM guilds JOIN profiles ON guilds.owner_id = profiles.id WHERE url = ?`,[url])
        if( !guildData ){
            return NextResponse.json({ success: false, message: "Гильдия не найдена" }, {status:404});
        }
        return NextResponse.json({ success: true, data: guildData }, {status:200})
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}
export async function POST(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;
    const data = await request.json();
    const formData = data.formData;

    const userSchema = Joi.object({
        formData: Joi.required(),
    })

    const { error } = userSchema.validate(data);
    if (error) {
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try{
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`},
        })

        if ( !response.ok ){
            const errorData = await response.json()
            return NextResponse.json({success: false, message: 'Не удалось получить данные о пользователе', error: errorData || response.statusText},{status: response.status})
        }

        const json = await response.json()
        if( !json.success ){
            return NextResponse.json({ success: false, message: json.message }, { status: 401 });
        }

        const user = json.profile;

        if(!user.in_guild){
            return NextResponse.json({ success: false, message: 'Вы не состоите в гильдии' },{status:401})
        }

        const [guildData] : any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if( !guildData ){
            return NextResponse.json({ success: false, message: 'Гильдия не найдена' },{status:404})
        }

        const [userGuild] : any = await query('SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?', [user.id, guildData.id])
        if ( !userGuild || userGuild.permission != 2 ){
            return NextResponse.json({ success: false, message: 'У вас нету доступа к этой гильдии' },{status:401})
        }

        const updates: string[] = []
        const values: any = []

        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                updates.push(`${key} = ?`);
                values.push(formData[key]);
            }
        }

        if (updates.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        values.push(url);
        await query(`UPDATE guilds SET ${updates.join(', ')} WHERE url = ?`, values)
        return NextResponse.json({ success: true, message: "Информация о гильдии успешно обновлена" }, { status: 200 });
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}
export async function DELETE(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
    const {url} = await params;

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`},
        })

        if ( !response.ok ){
            const errorData = await response.json()
            return NextResponse.json({success: false, message: 'Не удалось получить данные о пользователе', error: errorData || response.statusText},{status: response.status})
        }

        const json = await response.json()
        if( !json.success ){
            return NextResponse.json({ success: false, message: json.message }, { status: 401 });
        }

        const user = json.profile;

        const [guildData] : any = await query(`SELECT * FROM guilds WHERE url = ?`,[url])
        if( !guildData ){
            return NextResponse.json({ success: false, message: 'Гильдия не найдена' },{status:404})
        }

        if( !user.in_guild ){
            return NextResponse.json({ success: false, message: 'Вы не состоите в гильдии' },{status:401})
        }
        const [userGuild] : any = await query('SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?', [user.id, guildData.id])
        if ( !userGuild || userGuild.permission != 2 ){
            return NextResponse.json({ success: false, message: 'У вас нету доступа к этой гильдии' },{status:401})
        }

        await query("DELETE FROM guilds_applications WHERE fk_guild = ?", [guildData.id])
        await query("DELETE FROM guilds_members WHERE fk_guild = ?", [guildData.id])
        await query("DELETE FROM guilds WHERE id = ?", [guildData.id])
        await query('UPDATE profiles SET in_guild = 0 WHERE id = ?', [user.id])

        return NextResponse.json({ success: true, message: 'Гильдия успешно удалена' },{status:200})
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, {status:500})
    }
}