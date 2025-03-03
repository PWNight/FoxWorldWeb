import { NextRequest, NextResponse } from "next/server";

const client_id = '921482377505673267'
const client_secret = 'zqfzBi25FG7mCxqNjQsMU3z4WyJ0QLTP'
const redirect_uri = 'http://localhost:3000/api/v1/auth/discord-link'
const grant_type = 'authorization_code'
const discord_auth_url = 'https://discord.com/oauth2/authorize?client_id=921482377505673267&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fv1%2Fauth%2Fdiscord-link&scope=identify+guilds.join'
const discord_token_url = 'https://discord.com/api/oauth2/token'
const discord_user_url = 'https://discord.com/api/users/@me'

export async function GET(request: NextRequest) {
  try {
    const meURL = new URL('/me', request.url);
    const mainURL = new URL('/', request.url);
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Проверка ошибки авторизации
    if (error) {
      const errorDescription = searchParams.get('error_description');
      console.error('Auth error:', { error, errorDescription });
      return NextResponse.redirect(mainURL, { status: 302 });
    }

    // Проверка наличия кода
    if (!code) {
      const authURL = new URL(discord_auth_url);
      // Здесь можно добавить дополнительные параметры для authURL если нужно
      return NextResponse.redirect(authURL);
    }


    // Формирование тела запроса для получения токена
    const body = new URLSearchParams({
      client_id,
      client_secret,
      grant_type,
      redirect_uri,
      code,
    }).toString();

    // Получение токена доступа
    const tokenResponse = await fetch(discord_token_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body,
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token fetch error:', errorData);
      return NextResponse.redirect(mainURL, { status: 302 });
    }

    const accessData = await tokenResponse.json();

    // Получение данных пользователя
    const userResponse = await fetch(discord_user_url, {
      headers: {
        Authorization: `${accessData.token_type} ${accessData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error('User fetch error:', errorData);
      return NextResponse.redirect(mainURL, { status: 302 });
    }

    const userData = await userResponse.json();
    console.log('User data:', userData);

    // TODO: Прописать логику для сохранения данных о игроке

    return NextResponse.redirect(meURL, { status: 302 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.redirect(new URL('/', request.url), { status: 302 });
  }
}