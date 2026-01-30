import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, error: "No se ha subido ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        console.error("Error creating upload dir:", e);
    }

    const filepath = path.join(uploadDir, filename);

    try {
        await writeFile(filepath, buffer);
        console.log(`Saved file to ${filepath}`);
        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    } catch (e) {
        console.error("Error saving file:", e);
        return NextResponse.json({ success: false, error: "Error al guardar el archivo" }, { status: 500 });
    }
}
