import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/src/lib/auth';
import BlogPost from '@/src/models/BlogPost';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ensureBlogPostsReady, getCachedBlogPosts, mapBlogRow } from '@/src/lib/data/blog';
import { TAG_BLOG_LIST } from '@/src/lib/revalidate-tags';
import { allocateUniqueBlogSlug } from '@/src/lib/blog/slug';
import { isMediaCategory, MEDIA_LISTINGS } from '@/src/lib/blog/categories';
import { readEventFields } from '@/src/lib/blog/event-fields';

export async function GET() {
  try {
    const posts = await getCachedBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const image = typeof body.image === 'string' ? body.image.trim() : '';
    const content = typeof body.content === 'string' ? body.content : '';
    const status =
      body.status === 'Active' || body.status === 'Inactive' || body.status === 'Draft'
        ? body.status
        : 'Draft';

    if (!isMediaCategory(category)) {
      return NextResponse.json(
        { error: 'Category must be News, Event, Blog, or CSR.' },
        { status: 400 }
      );
    }

    const event = readEventFields(category, body);
    if (event.error) {
      return NextResponse.json({ error: event.error }, { status: 400 });
    }

    if (!title || !excerpt || !category || !image || !content.trim()) {
      return NextResponse.json(
        { error: 'Title, excerpt, category, image, and content are required.' },
        { status: 400 }
      );
    }

    await ensureBlogPostsReady();

    const slug = await allocateUniqueBlogSlug(
      title,
      typeof body.slug === 'string' ? body.slug : null
    );

    let publishedAt: Date | null = null;
    if (typeof body.publishedAt === 'string' && body.publishedAt.trim()) {
      const parsed = new Date(body.publishedAt);
      publishedAt = Number.isNaN(parsed.getTime()) ? null : parsed;
    } else if (status === 'Active') {
      publishedAt = new Date();
    }

    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      category,
      image,
      content,
      status,
      publishedAt,
      metaTitle:
        typeof body.metaTitle === 'string' && body.metaTitle.trim()
          ? body.metaTitle.trim()
          : null,
      metaDescription:
        typeof body.metaDescription === 'string' && body.metaDescription.trim()
          ? body.metaDescription.trim()
          : null,
      eventDate: event.fields.eventDate,
      eventLocation: event.fields.eventLocation,
    });

    revalidateTag(TAG_BLOG_LIST, 'max');
    revalidatePath('/sitemap.xml');
    for (const listing of MEDIA_LISTINGS) {
      revalidatePath(listing.path);
    }

    return NextResponse.json(mapBlogRow(post), { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
