import { createSession, encrypt } from "@/lib/session";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const client_id = '921482377505673267'
const client_secret = 'zqfzBi25FG7mCxqNjQsMU3z4WyJ0QLTP'
const redirect_uri = 'https://foxworld.ru/api/v1/auth/discord-link'
const grant_type = 'authorization_code'
const scope = 'identify%20guilds';
const discord_auth_url = 'https://discord.com/oauth2/authorize?client_id=921482377505673267&response_type=code&redirect_uri=https%3A%2F%2Fdev.foxworld.ru%2Fapi%2Fv1%2Fauth%2Fdiscord-link&scope=identify+guilds.join'
const discord_token_url = 'https://discord.com/api/oauth2/token'
const discord_user_url = 'https://discord.com/api/users/@me'

export async function GET(request: NextRequest, response: NextApiResponse) {
    const meURL = new URL("/me", request.url)
    const mainURL = new URL("/", request.url)
    const {searchParams} = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if(code == null || code == ''){
        const mainURL = new URL(discord_auth_url, request.url)
        return NextResponse.redirect(mainURL)
    }
    if(error !== null || error !== ''){
        const errorDescription = searchParams.get('error_description')
        console.log({ error: error, errorDescription: errorDescription }, { status: 500 })
        return NextResponse.redirect(mainURL,302)
    }

    const body = new URLSearchParams({
        client_id,
        client_secret,
        grant_type,
        redirect_uri,
        code,
        scope,
    }).toString()

    const getAccess = await fetch(discord_token_url, {
        headers:{"Content-Type": "application/x-www-form-urlencoded"},
        method: "POST",
        body: body
    })

    if(!getAccess.ok){
        const data = await getAccess.json();
        console.log({ error: data.error, error_description: data.error_description }, { status: getAccess.status })
        return NextResponse.redirect(mainURL,302)
    }

    const accessData = await getAccess.json();
    const getUser = await fetch(discord_user_url,{headers: { Authorization: `${accessData.token_type} ${accessData.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded' }})
    const userData = await getUser.json()

    console.log(userData)
    return NextResponse.redirect(meURL,302)
}