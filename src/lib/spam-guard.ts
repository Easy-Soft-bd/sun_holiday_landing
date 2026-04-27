import { Op } from 'sequelize';
import Booking from '@/src/models/Booking';
import Lead from '@/src/models/Lead';

type Bucket = { count: number; first: number; last: number };

/**
 * Simple in-memory rate limiter that protects public POST endpoints from
 * obvious flooding. State lives in the Node.js process – fine for a single
 * server, but consider replacing with Redis once we go horizontally scaled.
 */
const buckets = new Map<string, Bucket>();
const BUCKET_WINDOW_MS = 60_000; // 1 minute
const BUCKET_MAX_HITS = 6; // Max hits per IP/key per window
const BUCKET_BLOCK_MS = 5 * 60_000; // 5 minute cool-down once tripped

function pruneBuckets(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.last > BUCKET_BLOCK_MS) {
      buckets.delete(key);
    }
  }
}

export function isRateLimited(key: string | null | undefined): {
  limited: boolean;
  retryAfterMs?: number;
} {
  if (!key) return { limited: false };
  const now = Date.now();
  pruneBuckets(now);

  const existing = buckets.get(key);
  if (!existing) {
    buckets.set(key, { count: 1, first: now, last: now });
    return { limited: false };
  }

  // Reset window when stale
  if (now - existing.first > BUCKET_WINDOW_MS) {
    existing.count = 1;
    existing.first = now;
    existing.last = now;
    return { limited: false };
  }

  existing.count += 1;
  existing.last = now;

  if (existing.count > BUCKET_MAX_HITS) {
    return {
      limited: true,
      retryAfterMs: Math.max(BUCKET_WINDOW_MS - (now - existing.first), 1000),
    };
  }
  return { limited: false };
}

const SUSPICIOUS_PATTERNS = [
  /https?:\/\/[^\s]+\b(viagra|cialis|crypto|loan|casino|escort)\b/i,
  /\bbuy\s+now\b/i,
  /<script\b/i,
  /\[url=https?:\/\//i,
];

export function looksLikeSpam(text: string | null | undefined): boolean {
  if (!text) return false;
  const value = String(text);
  if (value.length > 5000) return true;
  let linkCount = 0;
  const linkRegex = /https?:\/\//gi;
  while (linkRegex.exec(value)) linkCount += 1;
  if (linkCount >= 4) return true;
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(value));
}

const DUP_WINDOW_MS = 10 * 60_000; // 10 minutes

/**
 * Detect rapid-fire duplicate submissions from the same IP/email/phone.
 * Returns `true` if an identical-looking record was created very recently.
 */
export async function isDuplicateBooking(input: {
  ipAddress?: string | null;
  email: string;
  phone: string;
  message?: string | null;
}): Promise<boolean> {
  const since = new Date(Date.now() - DUP_WINDOW_MS);
  const orClauses: Array<Record<string, unknown>> = [
    { email: input.email },
    { phone: input.phone },
  ];
  if (input.ipAddress) orClauses.push({ ipAddress: input.ipAddress });

  const recent = await Booking.findOne({
    where: {
      createdAt: { [Op.gte]: since },
      [Op.or]: orClauses,
    },
    order: [['createdAt', 'DESC']],
  });
  if (!recent) return false;
  const sameMessage = (recent.message || '').trim() === (input.message || '').trim();
  return sameMessage;
}

export async function isDuplicateLead(input: {
  ipAddress?: string | null;
  email: string;
  phone: string;
  message?: string | null;
}): Promise<boolean> {
  const since = new Date(Date.now() - DUP_WINDOW_MS);
  const orClauses: Array<Record<string, unknown>> = [
    { email: input.email },
    { phone: input.phone },
  ];
  if (input.ipAddress) orClauses.push({ ipAddress: input.ipAddress });

  const recent = await Lead.findOne({
    where: {
      createdAt: { [Op.gte]: since },
      [Op.or]: orClauses,
    },
    order: [['createdAt', 'DESC']],
  });
  if (!recent) return false;
  const sameMessage = (recent.message || '').trim() === (input.message || '').trim();
  return sameMessage;
}
