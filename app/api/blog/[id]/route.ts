import { NextRequest, NextResponse } from 'next/server';
import BlogPost from '@/src/models/BlogPost';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  getCachedBlogPostById,
  mapBlogRow,
  type BlogPostRecord,
} from '@/src/lib/data/blog';
import { TAG_BLOG_LIST, blogDetailTag, blogRouteTag } from '@/src/lib/revalidate-tags';
import { allocateUniqueBlogSlug } from '@/src/lib/blog/slug';

interface Params {
  params: Promise<{ id: string }>;
}

function revalidateBlogCaches(prev: BlogPostRecord, next?: BlogPostRecord) {
  revalidateTag(TAG_BLOG_LIST, 'max');
  revalidateTag(blogDetailTag(prev.id), 'max');
  revalidateTag(blogRouteTag(String(prev.id)), 'max');
  if (prev.slug?.trim()) {
    revalidateTag(blogRouteTag(prev.slug.trim()), 'max');
  }
  if (next) {
    revalidateTag(blogDetailTag(next.id), 'max');
    revalidateTag(blogRouteTag(String(next.id)), 'max');
    if (next.slug?.trim()) {
      revalidateTag(blogRouteTag(next.slug.trim()), 'max');
    }
  }
  revalidatePath('/sitemap.xml');
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const post = await getCachedBlogPostById(id);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    await sequelize.authenticate();

    const post = await BlogPost.findByPk(id);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const prev = mapBlogRow(post);

    const title =
      typeof body.title === 'string' && body.title.trim() ? body.title.trim() : prev.title;
    const excerpt =
      typeof body.excerpt === 'string' && body.excerpt.trim()
        ? body.excerpt.trim()
        : prev.excerpt;
    const category =
      typeof body.category === 'string' && body.category.trim()
        ? body.category.trim()
        : prev.category;
    const image =
      typeof body.image === 'string' && body.image.trim() ? body.image.trim() : prev.image;
    const content =
      typeof body.content === 'string' ? body.content : prev.content;
    const status =
      body.status === 'Active' || body.status === 'Inactive' || body.status === 'Draft'
        ? body.status
        : prev.status;

    let nextSlug: string;
    if (body.slug !== undefined && String(body.slug).trim() !== '') {
      nextSlug = await allocateUniqueBlogSlug(title, String(body.slug), post.id);
    } else if (prev.slug?.trim()) {
      nextSlug = prev.slug.trim();
    } else {
      nextSlug = await allocateUniqueBlogSlug(title, null, post.id);
    }

    let publishedAt: Date | null =
      prev.publishedAt != null ? new Date(prev.publishedAt) : null;
    if (body.publishedAt === null) {
      publishedAt = null;
    } else if (typeof body.publishedAt === 'string' && body.publishedAt.trim()) {
      const parsed = new Date(body.publishedAt);
      publishedAt = Number.isNaN(parsed.getTime()) ? publishedAt : parsed;
    } else if (status === 'Active' && !publishedAt) {
      publishedAt = new Date();
    }

    const metaTitle =
      body.metaTitle === null
        ? null
        : typeof body.metaTitle === 'string'
          ? body.metaTitle.trim() || null
          : prev.metaTitle ?? null;
    const metaDescription =
      body.metaDescription === null
        ? null
        : typeof body.metaDescription === 'string'
          ? body.metaDescription.trim() || null
          : prev.metaDescription ?? null;

    await post.update({
      title,
      slug: nextSlug,
      excerpt,
      category,
      image,
      content,
      status,
      publishedAt,
      metaTitle,
      metaDescription,
    });
    await post.reload();
    const next = mapBlogRow(post);

    revalidateBlogCaches(prev, next);

    return NextResponse.json(next);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { id } = await params;
    await sequelize.authenticate();

    const post = await BlogPost.findByPk(id);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const prev = mapBlogRow(post);
    await post.destroy();
    revalidateBlogCaches(prev);

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
