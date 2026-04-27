import type { NextRequest } from 'next/server';

/**
 * Extract the best-effort client IP from common proxy headers.
 * Falls back to the next request `ip` (when available) or `null`.
 */
export function getClientIp(request: Request | NextRequest): string | null {
  const headers = request.headers;
  const candidates = [
    headers.get('cf-connecting-ip'),
    headers.get('x-real-ip'),
    headers.get('x-client-ip'),
    headers.get('true-client-ip'),
    headers.get('x-forwarded-for'),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const first = candidate.split(',')[0]?.trim();
    if (first) return first.replace(/^::ffff:/, '');
  }
  return null;
}

export function getUserAgent(request: Request | NextRequest): string | null {
  const ua = request.headers.get('user-agent');
  return ua ? ua.slice(0, 500) : null;
}

export function getReferrer(request: Request | NextRequest): string | null {
  return request.headers.get('referer') || request.headers.get('referrer') || null;
}

/**
 * Capture metadata that we want to store alongside every public submission.
 */
export function getRequestContext(request: Request | NextRequest) {
  return {
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request),
    referrer: getReferrer(request),
  };
}
