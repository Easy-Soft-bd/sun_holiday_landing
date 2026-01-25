import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readdir, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { isAdmin } from '@/src/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let fileName: string;
    let uploadDir: string;
    let fileUrl: string;

    if (type === 'logo') {
      uploadDir = join(process.cwd(), 'public', 'logo', 'main');
      
      // Ensure directory exists
      await mkdir(uploadDir, { recursive: true });

      // Find current version and cleanup
      const files = await readdir(uploadDir);
      let maxVersion = 0;
      for (const f of files) {
        if (f.startsWith('logoV') && f.endsWith('.png')) {
          const versionMatch = f.match(/logoV(\d+)\.png/);
          if (versionMatch) {
            const v = parseInt(versionMatch[1]);
            if (v > maxVersion) maxVersion = v;
          }
          // Delete existing versions
          try {
            await unlink(join(uploadDir, f));
          } catch (e) {
            console.error(`Failed to delete old logo file ${f}:`, e);
          }
        }
      }

      const newVersion = maxVersion + 1;
      fileName = `logoV${newVersion}.png`;
      fileUrl = `/logo/main/${fileName}`;
    } else {
      // Generate unique filename for other uploads
      const fileExtension = file.name.split('.').pop();
      fileName = `${uuidv4()}.${fileExtension}`;
      uploadDir = join(process.cwd(), 'public', 'uploads');
      
      // Ensure directory exists
      await mkdir(uploadDir, { recursive: true });
      
      fileUrl = `/uploads/${fileName}`;
    }

    const path = join(uploadDir, fileName);
    await writeFile(path, buffer);

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: fileName,
      originalName: file.name
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
