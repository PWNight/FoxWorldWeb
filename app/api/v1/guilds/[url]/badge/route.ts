import {NextRequest, NextResponse} from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest, {params}: { params: Promise<{ url: string }> }) {
  try {
    const {url} = await params;
    const formData = await request.formData();

    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, message: "Отсутствует изображение" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      await writeFile(
        path.join(process.cwd(), "public/guilds/badges/" + `${url}.png`),
        buffer
      );
      return NextResponse.json({ success: true, message: "Успешно", status: 200 });
    } catch (error) {
      return NextResponse.json({success: false, message: 'Internal Server Error', error}, {status:500})
    }
  } catch (error) {
  }
}