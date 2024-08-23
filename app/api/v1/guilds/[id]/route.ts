import { NextRequest, NextResponse } from "next/server";
import connection from "@/lib/mysql";
import { useState } from "react";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id

    let [guildData] = await connection.promise().query(`SELECT * FROM guilds WHERE id = '${id}'`)
    console.log(guildData)
    return NextResponse.json({data: guildData}, {status:200})
}