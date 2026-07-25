import { NextResponse } from 'next/server';
import { getIconNames, getIconTree } from '@/src/lib/icons/icon-data';
import { normalizeIconName } from '@/src/lib/icons/icon-aliases';

/**
 * Serves the React Icons catalogue to the admin icon picker.
 *
 * The picker used to import all 31 packs to render previews, which duplicated
 * 41MB of JavaScript into every chunk that contained it. Resolving names here
 * instead keeps the browser bundle free of the library entirely.
 *
 * `?names=` returns drawing trees for specific icons, `?manifest=1` the full
 * name list. Icon data only changes when the dependency does, so responses are
 * immutable for caching purposes.
 */

/** Bounds the response size and the work a single request can ask for. */
const MAX_NAMES_PER_REQUEST = 500;

const IMMUTABLE = {
  'Cache-Control': 'public, max-age=31536000, immutable',
} as const;

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;

    if (params.get('manifest')) {
      return NextResponse.json(
        { success: true, data: await getIconNames() },
        { headers: IMMUTABLE },
      );
    }

    const requested = (params.get('names') ?? '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .slice(0, MAX_NAMES_PER_REQUEST);

    if (requested.length === 0) {
      return NextResponse.json({ error: 'No icon names requested' }, { status: 400 });
    }

    const trees: Record<string, unknown> = {};

    await Promise.all(
      requested.map(async (name) => {
        const tree = await getIconTree(normalizeIconName(name));

        // Unknown names are reported as null so the client caches the miss
        // rather than re-requesting the same name on every render.
        trees[name] = tree ?? null;
      }),
    );

    return NextResponse.json({ success: true, data: trees }, { headers: IMMUTABLE });
  } catch (error) {
    console.error('Error resolving icons:', error);
    return NextResponse.json({ error: 'Failed to resolve icons' }, { status: 500 });
  }
}
