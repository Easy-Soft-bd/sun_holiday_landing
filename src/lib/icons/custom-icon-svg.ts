/**
 * Turns pasted SVG markup into a canonical, safe icon tree.
 *
 * Admin-pasted markup is untrusted: it reaches every public page, so a single
 * `<script>` or `onload` would be stored XSS. Rather than cleaning the string and
 * hoping the browser parses it the same way we did, this module parses the input,
 * validates it against an allowlist, and keeps only the elements and attributes
 * it recognises. Consumers render the resulting tree through React
 * (`CustomIconSvg`), so the original string is never injected as HTML and a
 * parser disagreement cannot smuggle markup through.
 */

export interface IconNode {
  tag: string;
  attrs: Record<string, string>;
  children: IconNode[];
  /** Only ever set for text-bearing tags such as `title`. */
  text?: string;
}

export interface ParsedCustomIcon {
  viewBox: string;
  /**
   * Presentation attributes from the root `<svg>`. Outline icon sets put
   * `fill="none" stroke="currentColor"` here and inherit it, so dropping these
   * would render those icons as solid blobs.
   */
  rootAttrs: Record<string, string>;
  nodes: IconNode[];
}

export type ParseCustomIconResult =
  | { ok: true; icon: ParsedCustomIcon }
  | { ok: false; error: string };

export const DEFAULT_VIEW_BOX = "0 0 24 24";

/** Shape, grouping and paint-server tags that icon sets actually use. */
const ALLOWED_TAGS = new Set([
  "circle",
  "clipPath",
  "defs",
  "desc",
  "ellipse",
  "g",
  "line",
  "linearGradient",
  "mask",
  "path",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "symbol",
  "text",
  "title",
  "tspan",
  "use",
]);

/** Tags that make an icon unsafe or able to load remote content. */
const REJECTED_TAGS = new Set([
  "a",
  "animate",
  "animateMotion",
  "animateTransform",
  "audio",
  "foreignObject",
  "handler",
  "iframe",
  "image",
  "script",
  "set",
  "style",
  "video",
]);

const ALLOWED_ATTRS = new Set([
  "clip-path",
  "clip-rule",
  "cx",
  "cy",
  "d",
  "dominant-baseline",
  "dx",
  "dy",
  "fill",
  "fill-opacity",
  "fill-rule",
  "font-family",
  "font-size",
  "font-weight",
  "gradientTransform",
  "gradientUnits",
  "height",
  "id",
  "letter-spacing",
  "mask",
  "offset",
  "opacity",
  "paint-order",
  "points",
  "preserveAspectRatio",
  "r",
  "rx",
  "ry",
  "shape-rendering",
  "spreadMethod",
  "stop-color",
  "stop-opacity",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "text-anchor",
  "transform",
  "vector-effect",
  "viewBox",
  "width",
  "x",
  "x1",
  "x2",
  "y",
  "y1",
  "y2",
]);

/** Tags whose text content is meaningful and worth keeping. */
const TEXT_TAGS = new Set(["desc", "text", "title", "tspan"]);

/** Attributes that may reference another node, and only by fragment. */
const REFERENCE_ATTRS = new Set(["href", "xlink:href"]);

const DANGEROUS_VALUE = /javascript:|vbscript:|data:(?!image\/)/i;

interface RawTag {
  name: string;
  attrs: Record<string, string>;
  selfClosing: boolean;
  closing: boolean;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function parseAttributes(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const pattern = /([:A-Za-z_][-:.\w]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    const name = match[1];
    let value = match[2] ?? "";

    if (value.startsWith('"') || value.startsWith("'")) {
      value = value.slice(1, -1);
    }

    attrs[name] = decodeEntities(value.trim());
  }

  return attrs;
}

/**
 * Walks the markup, yielding tags and text while skipping comments, CDATA,
 * doctypes and processing instructions.
 */
function* tokenize(markup: string): Generator<RawTag | { text: string }> {
  let index = 0;

  while (index < markup.length) {
    const next = markup.indexOf("<", index);

    if (next === -1) {
      const text = markup.slice(index);
      if (text.trim()) {
        yield { text: decodeEntities(text) };
      }
      return;
    }

    if (next > index) {
      const text = markup.slice(index, next);
      if (text.trim()) {
        yield { text: decodeEntities(text) };
      }
    }

    if (markup.startsWith("<!--", next)) {
      const end = markup.indexOf("-->", next);
      index = end === -1 ? markup.length : end + 3;
      continue;
    }

    if (markup.startsWith("<![CDATA[", next)) {
      const end = markup.indexOf("]]>", next);
      index = end === -1 ? markup.length : end + 3;
      continue;
    }

    if (markup.startsWith("<!", next) || markup.startsWith("<?", next)) {
      const end = markup.indexOf(">", next);
      index = end === -1 ? markup.length : end + 1;
      continue;
    }

    const end = markup.indexOf(">", next);

    if (end === -1) {
      return;
    }

    const inner = markup.slice(next + 1, end);
    const closing = inner.startsWith("/");
    const selfClosing = inner.endsWith("/");
    const body = inner.replace(/^\//, "").replace(/\/$/, "");
    const nameMatch = /^([A-Za-z][-:.\w]*)/.exec(body);

    index = end + 1;

    if (!nameMatch) {
      continue;
    }

    yield {
      name: nameMatch[1],
      attrs: closing ? {} : parseAttributes(body.slice(nameMatch[1].length)),
      selfClosing,
      closing,
    };
  }
}

/** Drops the namespace prefix so `svg:path` is treated as `path`. */
function localName(name: string): string {
  const colon = name.lastIndexOf(":");
  return colon === -1 ? name : name.slice(colon + 1);
}

function canonicalTag(name: string): string | null {
  const local = localName(name);

  for (const allowed of ALLOWED_TAGS) {
    if (allowed.toLowerCase() === local.toLowerCase()) {
      return allowed;
    }
  }

  return null;
}

function canonicalAttr(name: string): string | null {
  for (const allowed of ALLOWED_ATTRS) {
    if (allowed.toLowerCase() === name.toLowerCase()) {
      return allowed;
    }
  }

  return null;
}

function isRejectedTag(name: string): boolean {
  const local = localName(name).toLowerCase();

  for (const rejected of REJECTED_TAGS) {
    if (rejected.toLowerCase() === local) {
      return true;
    }
  }

  return false;
}

function sanitizeAttributes(
  raw: Record<string, string>,
): { attrs: Record<string, string> } | { error: string } {
  const attrs: Record<string, string> = {};

  for (const [rawName, rawValue] of Object.entries(raw)) {
    const name = rawName.toLowerCase();
    const value = rawValue.trim();

    // Event handlers are never acceptable, even if the rest of the icon is fine.
    if (name.startsWith("on")) {
      return { error: `Event handler attributes are not allowed (found "${rawName}").` };
    }

    if (DANGEROUS_VALUE.test(value)) {
      return { error: `Unsafe attribute value on "${rawName}".` };
    }

    if (REFERENCE_ATTRS.has(name)) {
      if (!value.startsWith("#")) {
        return { error: 'References must point inside the icon, e.g. href="#id".' };
      }
      attrs.href = value;
      continue;
    }

    // `url(...)` may only reference a node inside this icon, never a remote one.
    if (value.includes("url(") && !/^url\(['"]?#/.test(value)) {
      return { error: `Only internal url(#id) references are allowed (found "${rawName}").` };
    }

    const canonical = canonicalAttr(rawName);

    // Unknown-but-harmless attributes (xmlns, style, class, data-*) are dropped
    // rather than rejected so ordinary icon markup still pastes cleanly.
    if (canonical) {
      attrs[canonical] = value;
    }
  }

  return { attrs };
}

function viewBoxFrom(attrs: Record<string, string>): string {
  const viewBox = attrs.viewBox?.trim();

  if (viewBox && /^-?[\d.]+(\s+|,)\s*-?[\d.]+(\s+|,)\s*[\d.]+(\s+|,)\s*[\d.]+$/.test(viewBox)) {
    return viewBox.replace(/,/g, " ").replace(/\s+/g, " ");
  }

  const width = Number.parseFloat(attrs.width ?? "");
  const height = Number.parseFloat(attrs.height ?? "");

  if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
    return `0 0 ${width} ${height}`;
  }

  return DEFAULT_VIEW_BOX;
}

/** Dimensions and identity are controlled by the renderer, not the pasted markup. */
const ROOT_ATTRS_TO_DROP = new Set(["viewBox", "width", "height", "id", "preserveAspectRatio"]);

function rootAttrsFrom(attrs: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !ROOT_ATTRS_TO_DROP.has(name)),
  );
}

function countNodes(nodes: IconNode[]): number {
  return nodes.reduce((total, node) => total + 1 + countNodes(node.children), 0);
}

/** Validates pasted markup and returns the canonical tree to store. */
export function parseCustomIconSvg(markup: string): ParseCustomIconResult {
  const source = String(markup ?? "").trim();

  if (!source) {
    return { ok: false, error: "Paste the SVG markup for this icon." };
  }

  if (source.length > 64_000) {
    return { ok: false, error: "That SVG is too large for an icon (64KB limit)." };
  }

  const root: IconNode = { tag: "root", attrs: {}, children: [] };
  const stack: IconNode[] = [root];
  let svgRoot: IconNode | null = null;

  for (const token of tokenize(source)) {
    if ("text" in token) {
      const parent = stack[stack.length - 1];
      if (TEXT_TAGS.has(parent.tag)) {
        parent.text = `${parent.text ?? ""}${token.text}`.trim();
      }
      continue;
    }

    if (isRejectedTag(token.name)) {
      return {
        ok: false,
        error: `<${localName(token.name)}> is not allowed in an icon.`,
      };
    }

    const tag = canonicalTag(token.name);

    if (!tag) {
      // Unrecognised drawing elements are skipped; a stray wrapper should not
      // block an otherwise valid icon.
      continue;
    }

    if (token.closing) {
      for (let i = stack.length - 1; i > 0; i -= 1) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }

    const sanitized = sanitizeAttributes(token.attrs);

    if ("error" in sanitized) {
      return { ok: false, error: sanitized.error };
    }

    if (tag === "svg") {
      if (svgRoot) {
        // A nested <svg> would let content escape the icon's coordinate system.
        continue;
      }
      svgRoot = { tag, attrs: sanitized.attrs, children: [] };
      stack.push(svgRoot);
      continue;
    }

    const node: IconNode = { tag, attrs: sanitized.attrs, children: [] };
    stack[stack.length - 1].children.push(node);

    if (!token.selfClosing) {
      stack.push(node);
    }
  }

  if (!svgRoot) {
    return { ok: false, error: "No <svg> element found in the pasted markup." };
  }

  if (svgRoot.children.length === 0) {
    return { ok: false, error: "That <svg> has no shapes to draw." };
  }

  if (countNodes(svgRoot.children) > 400) {
    return { ok: false, error: "That SVG has too many elements for an icon." };
  }

  return {
    ok: true,
    icon: {
      viewBox: viewBoxFrom(svgRoot.attrs),
      rootAttrs: rootAttrsFrom(svgRoot.attrs),
      nodes: svgRoot.children,
    },
  };
}

function toPlainObject(value: unknown): Record<string, unknown> | null {
  let raw = value;

  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
}

/**
 * Re-validates a stored icon on the way out. Rows written by an older build, or
 * edited directly in the database, are re-checked rather than trusted.
 */
export function parseStoredCustomIcon(value: unknown): ParsedCustomIcon | null {
  const raw = toPlainObject(value);

  if (!raw) {
    return null;
  }

  const nodes = parseStoredIconNodes(raw.nodes);

  if (nodes.length === 0) {
    return null;
  }

  const rootAttrsRaw = toPlainObject(raw.rootAttrs) ?? {};
  const sanitizedRoot = sanitizeAttributes(rootAttrsRaw as Record<string, string>);
  const viewBox = typeof raw.viewBox === "string" ? raw.viewBox : "";

  return {
    viewBox: viewBoxFrom({ viewBox }),
    rootAttrs: "error" in sanitizedRoot ? {} : rootAttrsFrom(sanitizedRoot.attrs),
    nodes,
  };
}

function parseStoredIconNodes(value: unknown): IconNode[] {
  let raw = value;

  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(raw)) {
    return [];
  }

  const revive = (entry: unknown): IconNode | null => {
    if (!entry || typeof entry !== "object") {
      return null;
    }

    const { tag, attrs, children, text } = entry as Record<string, unknown>;
    const canonical = typeof tag === "string" ? canonicalTag(tag) : null;

    if (!canonical || canonical === "svg") {
      return null;
    }

    const sanitized = sanitizeAttributes(
      attrs && typeof attrs === "object" ? (attrs as Record<string, string>) : {},
    );

    return {
      tag: canonical,
      attrs: "error" in sanitized ? {} : sanitized.attrs,
      children: Array.isArray(children)
        ? children.map(revive).filter((node): node is IconNode => node !== null)
        : [],
      ...(typeof text === "string" && text ? { text } : {}),
    };
  };

  return raw.map(revive).filter((node): node is IconNode => node !== null);
}
