import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { isAdmin } from "@/src/lib/auth";

export async function POST(request: Request) {
    try {
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const oldPath = formData.get("oldPath") as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}.webp`;
        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);

        // Optimize and save image using sharp
        await sharp(buffer)
            .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
            .toFormat("webp", { quality: 80 })
            .toFile(filePath);

        // Delete old file if provided and exists
        if (oldPath && oldPath.startsWith("/uploads/")) {
            const oldFilePath = path.join(process.cwd(), "public", oldPath);
            try {
                await fs.unlink(oldFilePath);
                console.log("Deleted old file:", oldFilePath);
            } catch (err) {
                console.warn("Could not delete old file:", oldFilePath, err);
            }
        }

        return NextResponse.json({ 
            success: true, 
            url: `/uploads/${filename}` 
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}
