import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { revalidateTag } from 'next/cache';
import { verifyAuth } from '@/src/lib/auth';
import { buildProcessedFilename, processFaviconImage, processUploadedImage } from '@/src/lib/image-process';
import { TAG_BLOG_LIST, TAG_GENERAL_SETTINGS, TAG_HOME_PAGE, TAG_SUNVIA_ECO_RESORT } from '@/src/lib/revalidate-tags';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const type = String(formData.get('type') || '');
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const faviconTypes = [...validTypes, 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];
    const faviconByName = type === 'favicon' && /\.(png|jpe?g|webp|gif|svg|ico)$/i.test(file.name);
    const allowed = type === 'favicon' ? faviconTypes.includes(file.type) || faviconByName : validTypes.includes(file.type);
    if (!allowed) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-');
    
    // Determine directory and URL based on type
    let uploadSubDir = 'uploads';
    let urlPrefix = '/uploads';

    if (type === 'logo') {
      uploadSubDir = 'logo';
      urlPrefix = '/logo';
    } else if (type === 'tour') {
      uploadSubDir = 'uploads/tours';
      urlPrefix = '/uploads/tours';
    } else if (type === 'sailor') {
      uploadSubDir = 'uploads/sailor';
      urlPrefix = '/uploads/sailor';
    } else if (type === 'blog') {
      uploadSubDir = 'uploads/blog';
      urlPrefix = '/uploads/blog';
    } else if (type === 'favicon') {
      uploadSubDir = 'uploads/favicon';
      urlPrefix = '/uploads/favicon';
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', uploadSubDir);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);
    const processed = type === 'favicon'
      ? await processFaviconImage(rawBuffer, file.type || 'image/png')
      : await processUploadedImage(rawBuffer, file.type);
    const processedName = buildProcessedFilename(originalName, processed.extension);
    const filename = `${timestamp}-${processedName}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, processed.buffer);
    // Uploads are currently used by admin-managed CMS content and branding assets.
    revalidateTag(TAG_HOME_PAGE, { expire: 0 });
    revalidateTag(TAG_GENERAL_SETTINGS, { expire: 0 });
    revalidateTag(TAG_SUNVIA_ECO_RESORT, { expire: 0 });
    revalidateTag(TAG_BLOG_LIST, { expire: 0 });
    
    // Return the public URL
    const fileUrl = `${urlPrefix}/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      filename: filename 
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
