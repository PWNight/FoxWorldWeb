import { NextResponse } from 'next/server';
import {query} from "@/lib/mysql";
import {getUserData} from "@/lib/utils";
import {sendErrorMessage} from "@/lib/discord";

export async function GET(request: Request) {
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

    const rows : any = await query(
      'SELECT * FROM notifications WHERE fk_profile = ? ORDER BY created_at DESC',
      [user.id]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[1] || "unknown";
      await sendErrorMessage(ip, 'api/v1/notifications', 'GET', 500,
          {
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
          }
      )

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

export async function POST(request: Request) {
  let { userId, nickname, message } = await request.json();
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
    const user = result.data;

    if (nickname){
        const [profile] : any = await query("SELECT * FROM profiles WHERE nick = ?", [nickname]);
        userId = profile.id;
    }

    if (userId !== user.profile.id){
        if ( !user.profile.hasAdmin ){
            return NextResponse.json({success: false, message: 'У вас нету прав на создание уведомлений для другого игрока'},{status: 403})
        }
    }

    await query(
      'INSERT INTO notifications (fk_profile, message) VALUES (?, ?)',
      [userId, message]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[1] || "unknown";
      await sendErrorMessage(ip, 'api/v1/notifications', 'POST', 500,
          {
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
          }
      )

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

export async function PATCH(request: Request) {
  const { id } = await request.json();
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
    const user = result.data;

    if (id !== user.profile.id){
        if ( !user.profile.hasAdmin ){
            return NextResponse.json({success: false, message: 'У вас нету прав на создание уведомлений для другого игрока'},{status: 403})
        }
    }

    await query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [id]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[1] || "unknown";
      await sendErrorMessage(ip, 'api/v1/notifications', 'PATCH', 500,
        {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR'
        }
      )

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