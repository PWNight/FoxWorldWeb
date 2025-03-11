import { NextResponse } from 'next/server';
import {query} from "@/lib/mysql";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
      return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
  }
  const token = authHeader.split(" ")[1];

  try {
    let response = await fetch(`https://foxworld.ru/api/v1/users/me`,{
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`}
    })

    if ( !response.ok ){
        const errorData = await response.json()
        return NextResponse.json({success: false, message: 'Не удалось получить данные о пользователе', error: errorData || response.statusText},{status: response.status})
    }

    const user = await response.json()
    const rows : any = await query(
      'SELECT * FROM notifications WHERE fk_profile = ? ORDER BY created_at DESC',
      [user.profile.id]
    );

    return NextResponse.json(rows);
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

export async function POST(request: Request) {
  let { userId, nickname, message } = await request.json();
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
      return NextResponse.json({success: false, message: 'Отсутствует заголовок авторизации'},{status: 401})
  }
  const token = authHeader.split(" ")[1];

  try {
    let response = await fetch(`https://foxworld.ru/api/v1/users/me`,{
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`}
    })

    if ( !response.ok ) {
        const errorData = await response.json()
        return NextResponse.json({
            success: false,
            message: 'Не удалось получить данные о пользователе',
            error: errorData || response.statusText
        }, {status: response.status})
    }
    const user = await response.json()

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
    let response = await fetch(`https://foxworld.ru/api/v1/users/me`,{
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`}
    })

    if ( !response.ok ){
        const errorData = await response.json()
        return NextResponse.json({success: false, message: 'Не удалось получить данные о пользователе', error: errorData || response.statusText},{status: response.status})
    }

    const user = await response.json()

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