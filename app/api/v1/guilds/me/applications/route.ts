import {NextRequest, NextResponse} from "next/server";
import {query} from "@/lib/mysql";
import {getUserData} from "@/lib/utils";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
    }
    const token = authHeader.split(" ")[1];

    try {
        const result = await getUserData(token);
        if ( !result.success ){
            return NextResponse.json(result, { status: result.status })
        }
        const user = result.data.profile;

        const userGuildsApplications : any = await query(`SELECT * FROM guilds_applications JOIN profiles ON fk_profile = profiles.id WHERE fk_profile = ? AND status = 'Рассматривается'`, [user.id])
        return NextResponse.json({ success: true, data: userGuildsApplications }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Серверная ошибка',
            error: {
                message: error.message,
                code: error.code || 'UNKNOWN_ERROR'
            }
        }, {status:500})
    }
}