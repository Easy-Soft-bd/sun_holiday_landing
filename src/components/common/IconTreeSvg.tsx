import { createElement, type ReactNode } from "react";
import type { IconTree } from "@/src/lib/icons/icon-data";

interface IconTreeSvgProps {
  tree: IconTree;
  className?: string;
  size?: number | string;
  color?: string;
  title?: string;
}

/**
 * Attributes the renderer sets itself, dropped from the root `<svg>` only.
 * Child nodes keep theirs: `width` and `height` size the `<rect>` and `<filter>`
 * elements many icons are built from, so stripping them there erases the shape.
 */
const ROOT_ATTRS_TO_DROP = new Set([
  "width",
  "height",
  "class",
  // A string, where React requires an object.
  "style",
  "role",
  "aria-hidden",
]);

/**
 * React Icons stores attributes camelCased already, so only the hyphenated
 * spellings need converting. ARIA and data attributes are the exception: React
 * expects those to stay hyphenated and warns when they are not.
 */
function toReactProps(
  attr: Record<string, string>,
  drop?: ReadonlySet<string>,
): Record<string, string> {
  const props: Record<string, string> = {};

  for (const [name, value] of Object.entries(attr)) {
    if (drop?.has(name)) {
      continue;
    }

    const propName =
      name.startsWith("aria-") || name.startsWith("data-")
        ? name
        : name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

    props[propName] = value;
  }

  return props;
}

function renderChildren(nodes: IconTree[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}${node.tag}-${index}`;

    return createElement(
      node.tag,
      { ...toReactProps(node.attr), key },
      node.child.length > 0 ? renderChildren(node.child, `${key}-`) : undefined,
    );
  });
}

/**
 * Draws an extracted React Icons tree. Rebuilding it as React elements matches
 * what `react-icons` itself does, so output is identical to importing the
 * component, without the library reaching any bundle.
 */
export default function IconTreeSvg({
  tree,
  className,
  size = "1em",
  color,
  title,
}: IconTreeSvgProps) {
  const { viewBox, ...rootAttrs } = toReactProps(tree.attr, ROOT_ATTRS_TO_DROP);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...rootAttrs}
      viewBox={viewBox}
      width={size}
      height={size}
      className={className}
      color={color}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {renderChildren(tree.child, "")}
    </svg>
  );
}
