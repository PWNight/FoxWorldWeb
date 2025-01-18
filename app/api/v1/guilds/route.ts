import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import Joi from "joi";

export async function GET(request: NextRequest) {
    try{
        let guildData:any = await query("SELECT * FROM guilds")
        if(!guildData){
            return NextResponse.json({success: true, data: {}}, {status:404})
        }
        return NextResponse.json({success: true, data: guildData}, {status:200})
    }catch (error: any){
        return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
    }
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const user_id = data.user_id;
    const url = data.url;
    const name = data.name;
    const description = data.description;
    const info = data.info;

    const userSchema = Joi.object({
        user_id: Joi.required(),
        url: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        info: Joi.string().required(),
    })
    const { error } = userSchema.validate(data);

    if (error){
        return NextResponse.json({ success: false, message: "Отсутствуют некоторые параметры", error }, { status: 401 });
    }else{
        try{
            const userGuilds : any = await query('SELECT permission FROM guilds_members WHERE uid = ?', [user_id])
            if (userGuilds.length > 0 && userGuilds[0].permission == 2){
                return NextResponse.json({success: false, message: 'Вы уже являетесь главой одной из гильдий'},{status:401})
            }

            const guildData : any = await query('SELECT * FROM guilds WHERE url = ?', [url])
            if(guildData.length != 0){
                return NextResponse.json({success: false, message: 'Гильдия с данной ссылкой уже существует'},{status:500})
            }

            await query('INSERT INTO guilds (owner_id, url, name, description, info) VALUES (?, ?, ?, ?, ?) RETURNING id', [user_id, url, name, description, info]);

            const guild : any = await query("SELECT id FROM guilds WHERE url = ?", [url])
            await query('INSERT INTO guilds_members (fk_guild, uid, permission) VALUES (?, ?, ?)', [guild[0].id, user_id, 2])

            return NextResponse.json({success: true, message: 'Гильдия успешно создана'},{status:200})
        }catch (error: any){
            return NextResponse.json({success: false, message: 'Internal Server Error', data: {errno: error.errno, sqlState: error.sqlState}}, {status:500})
        }
    }
}