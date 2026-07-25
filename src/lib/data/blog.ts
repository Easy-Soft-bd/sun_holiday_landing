import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import BlogPost, { BlogPostStatus } from '@/src/models/BlogPost';
import sequelize from '@/src/lib/db';
import { TAG_BLOG_LIST, blogDetailTag, blogRouteTag } from '@/src/lib/revalidate-tags';
import { allocateUniqueBlogSlug } from '@/src/lib/blog/slug';
import { SEED_BLOG_POSTS } from '@/src/view/blog/data/blogData';

export type BlogPostRecord = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  content: string;
  status: BlogPostStatus;
  publishedAt?: string | Date | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

/** Shape used by public blog UI components. */
export type BlogPostView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content: string;
  publishedAt?: string;
  updatedAt?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function formatBlogDisplayDate(value: unknown): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function mapBlogRow(post: BlogPost): BlogPostRecord {
  const plain = post.get({ plain: true }) as BlogPostRecord;
  return {
    ...plain,
    id: Number(plain.id),
    slug: typeof plain.slug === 'string' ? plain.slug : '',
    metaTitle: plain.metaTitle ?? null,
    metaDescription: plain.metaDescription ?? null,
    publishedAt: plain.publishedAt ?? null,
  };
}

export function toBlogPostView(post: BlogPostRecord): BlogPostView {
  const published =
    post.publishedAt ?? post.createdAt ?? null;
  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: formatBlogDisplayDate(published),
    category: post.category,
    image: post.image,
    content: post.content,
    publishedAt: toIso(published),
    updatedAt: toIso(post.updatedAt),
    metaTitle: post.metaTitle ?? null,
    metaDescription: post.metaDescription ?? null,
  };
}

async function seedBlogPostsIfEmpty() {
  const count = await BlogPost.count();
  if (count > 0) return;

  for (const seed of SEED_BLOG_POSTS) {
    const slug = await allocateUniqueBlogSlug(seed.title, null);
    const publishedAt = seed.date ? new Date(seed.date) : new Date();
    await BlogPost.create({
      title: seed.title,
      slug,
      excerpt: seed.excerpt,
      category: seed.category,
      image: seed.image,
      content: seed.content.trim(),
      status: 'Active',
      publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
      metaTitle: null,
      metaDescription: null,
    });
  }
}

async function ensureBlogTable() {
  await sequelize.authenticate();
  await BlogPost.sync();
  await seedBlogPostsIfEmpty();
}

const getBlogPostsFromDb = unstable_cache(
  async () => {
    await ensureBlogTable();

    const posts = await BlogPost.findAll({
      order: [
        ['publishedAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });

    return posts.map((post) => mapBlogRow(post));
  },
  ['blog', 'all'],
  {
    tags: [TAG_BLOG_LIST],
  }
);

export const getCachedBlogPosts = cache(async () => getBlogPostsFromDb());

export const getCachedActiveBlogPosts = cache(async () => {
  const posts = await getBlogPostsFromDb();
  return posts.filter((post) => post.status === 'Active');
});

export const getCachedBlogPostById = cache(async (id: string) => {
  const getPostFromDb = unstable_cache(
    async () => {
      await sequelize.authenticate();
      const post = await BlogPost.findByPk(id);
      if (!post) {
        return null;
      }
      return mapBlogRow(post);
    },
    ['blog', id],
    {
      tags: [blogDetailTag(id)],
    }
  );

  return getPostFromDb();
});

async function loadBlogByPublicParam(param: string): Promise<BlogPostRecord | null> {
  await ensureBlogTable();
  const key = decodeURIComponent(param).trim();
  if (!key) {
    return null;
  }

  const isNumeric = /^\d+$/.test(key);
  const row = isNumeric
    ? await BlogPost.findByPk(key)
    : await BlogPost.findOne({ where: { slug: key } });

  if (!row) {
    return null;
  }

  return mapBlogRow(row);
}

/**
 * Blog detail for public `/blog/[slug]` (slug or legacy numeric id).
 * Cache is keyed by URL segment; invalidate with `blogRouteTag(segment)` on writes.
 */
export const getCachedBlogForPublicPage = cache(async (param: string) => {
  const run = unstable_cache(
    async () => loadBlogByPublicParam(param),
    ['blog-public', param],
    { tags: [TAG_BLOG_LIST, blogRouteTag(param)] }
  );
  return run();
});

/** Prebuild only slug URLs; legacy `/blog/{id}` still works when `dynamicParams` is true. */
export async function generateStaticParamsForActiveBlogPosts() {
  const posts = await getCachedActiveBlogPosts();
  return posts
    .map((p) => (typeof p.slug === 'string' ? p.slug.trim() : ''))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}
