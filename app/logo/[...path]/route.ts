import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const rawPath = (await params).path;
    const filePath = join(process.cwd(), 'public', 'logo', ...rawPath);

    if (!existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    try {
        const fileBuffer = await readFile(filePath);
        
        // Determine content type based on extension
        const ext = filePath.split('.').pop()?.toLowerCase();
        const contentTypeMap: Record<string, string> = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'svg': 'image/svg+xml',
            'webp': 'image/webp',
            'gif': 'image/gif',
        };
        const contentType = contentTypeMap[ext || ''] || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving static file:', error);
        return new NextResponse('Error serving file', { status: 500 });
    }
}
