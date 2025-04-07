import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import Joi from "joi";
import { getUserData } from "@/lib/utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ url: string }> }) {
    const { url } = await params;

    try {
        // Fetch guild data to verify existence
        const [guildData]: any = await query(`SELECT id FROM guilds WHERE url = ?`, [url]);
        if (!guildData) {
            return NextResponse.json({ success: false, message: "Гильдия не найдена" }, { status: 404 });
        }

        // Fetch all images associated with the guild
        const imagesData: any = await query(
            `SELECT id, fk_guild, url, fk_profile, create_date 
             FROM guilds_images 
             WHERE fk_guild = ? 
             ORDER BY create_date DESC`,
            [guildData.id]
        );

        return NextResponse.json({ success: true, data: imagesData }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Серверная ошибка",
            error: {
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            },
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ url: string }> }) {
    const { url } = await params;
    const data = await request.json();
    const imageUrl = data.url;

    const imageSchema = Joi.object({
        url: Joi.string().uri().required().messages({
            "string.uri": "URL изображения должен быть действительным",
            "any.required": "URL изображения обязателен",
        }),
    });

    const { error } = imageSchema.validate(data);
    if (error) {
        return NextResponse.json(
            { success: false, message: "Ошибка валидации", error: error.details },
            { status: 400 }
        );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json(
            { success: false, message: "Отсутствует заголовок авторизации" },
            { status: 401 }
        );
    }
    const token = authHeader.split(" ")[1];

    try {
        const result = await getUserData(token);
        if (!result.success) {
            return NextResponse.json(result, { status: result.status });
        }
        const user = result.data.profile;

        if (!user.inGuild) {
            return NextResponse.json(
                { success: false, message: "Вы не состоите в гильдии" },
                { status: 401 }
            );
        }

        const [guildData]: any = await query(`SELECT id FROM guilds WHERE url = ?`, [url]);
        if (!guildData) {
            return NextResponse.json({ success: false, message: "Гильдия не найдена" }, { status: 404 });
        }

        const [userGuild]: any = await query(
            "SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?",
            [user.id, guildData.id]
        );
        if (!userGuild || userGuild.permission != 2) {
            return NextResponse.json(
                { success: false, message: "У вас нет доступа к этой гильдии" },
                { status: 401 }
            );
        }

        // Insert the new image into guilds_images (no array destructuring)
        const insertResult: any = await query(
            `INSERT INTO guilds_images (fk_guild, url, fk_profile, create_date) 
             VALUES (?, ?, ?, NOW())`,
            [guildData.id, imageUrl, user.id]
        );

        const newImage = {
            id: insertResult.insertId, // Access insertId directly
            fk_guild: guildData.id,
            url: imageUrl,
            fk_profile: user.id,
            create_date: new Date().toISOString(),
        };

        return NextResponse.json(
            { success: true, message: "Скриншот успешно добавлен", data: newImage },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Серверная ошибка",
            error: {
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            },
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ url: string; imageId?: number }> }
) {
    const { url } = await params;
    const imageId = await request.nextUrl.searchParams.get("imageId");
    console.log(url, imageId);

    if (!imageId) {
        return NextResponse.json(
            { success: false, message: "Отсутствует ID изображения" },
            { status: 400 }
        );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json(
            { success: false, message: "Отсутствует заголовок авторизации" },
            { status: 401 }
        );
    }
    const token = authHeader.split(" ")[1];

    try {
        const result = await getUserData(token);
        if (!result.success) {
            return NextResponse.json(result, { status: result.status });
        }
        const user = result.data.profile;

        console.log(url)
        const [guildData]: any = await query(`SELECT id FROM guilds WHERE url = ?`, [url]);
        if (!guildData) {
            return NextResponse.json({ success: false, message: "Гильдия не найдена" }, { status: 404 });
        }

        if (!user.inGuild) {
            return NextResponse.json(
                { success: false, message: "Вы не состоите в гильдии" },
                { status: 401 }
            );
        }

        const [userGuild]: any = await query(
            "SELECT permission FROM guilds_members WHERE uid = ? AND fk_guild = ?",
            [user.id, guildData.id]
        );
        if (!userGuild || userGuild.permission != 2) {
            return NextResponse.json(
                { success: false, message: "У вас нет доступа к этой гильдии" },
                { status: 401 }
            );
        }

        // Verify the image exists and belongs to the guild
        console.log(imageId)
        const [imageData]: any = await query(
            `SELECT id FROM guilds_images WHERE id = ? AND fk_guild = ?`,
            [imageId, guildData.id]
        );
        if (!imageData) {
            return NextResponse.json(
                { success: false, message: "Изображение не найдено" },
                { status: 404 }
            );
        }

        // Delete the image
        await query(`DELETE FROM guilds_images WHERE id = ? AND fk_guild = ?`, [imageId, guildData.id]);

        return NextResponse.json(
            { success: true, message: "Скриншот успешно удален" },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Серверная ошибка",
            error: {
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            },
        }, { status: 500 });
    }
}