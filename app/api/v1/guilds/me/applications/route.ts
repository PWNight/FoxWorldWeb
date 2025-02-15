import {NextRequest, NextResponse} from "next/server";
import {query} from "@/lib/mysql";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        let response = await fetch("https://foxworld.ru/api/v1/users/me",{
            method: "POST",
            body: JSON.stringify({session_token: token}),
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

        const userGuildsApplications : any = await query(`SELECT * FROM guilds_applications JOIN profiles ON fk_profile = profiles.id WHERE fk_profile = ? AND status = 'Рассматривается'`, [user.id])
        return NextResponse.json({ success: true, data: userGuildsApplications }, { status: 200 });
    }catch (error: any){
        return NextResponse.json({ success: false, message: 'Internal Server Error', error }, { status:500 })
    }
}