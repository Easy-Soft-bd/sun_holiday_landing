import { createElement, type ReactNode } from "react";
import type { IconNode, ParsedCustomIcon } from "@/src/lib/icons/custom-icon-svg";

interface CustomIconSvgProps {
  icon: ParsedCustomIcon;
  className?: string;
  size?: number | string;
  color?: string;
  title?: string;
}

/**
 * Icons are stored with SVG's hyphenated attribute names; React expects the
 * camelCased prop names and warns for every hyphenated one it sees.
 */
function toReactProps(attrs: Record<string, string>): Record<string, string> {
  const props: Record<string, string> = {};

  for (const [name, value] of Object.entries(attrs)) {
    const propName = name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    props[propName] = value;
  }

  return props;
}

function renderNodes(nodes: IconNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}${node.tag}-${index}`;
    const children = node.children.length > 0 ? renderNodes(node.children, `${key}-`) : undefined;

    return createElement(node.tag, { ...toReactProps(node.attrs), key }, node.text ?? children);
  });
}

/**
 * Draws a stored custom icon. The tree is rebuilt as React elements rather than
 * injected as HTML, so admin-supplied markup can never introduce new tags or
 * attributes beyond the ones the parser allowed.
 */
export default function CustomIconSvg({
  icon,
  className,
  size = "1em",
  color,
  title,
}: CustomIconSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={icon.viewBox}
      width={size}
      height={size}
      className={className}
      color={color}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...toReactProps(icon.rootAttrs)}
    >
      {title ? <title>{title}</title> : null}
      {renderNodes(icon.nodes, "")}
    </svg>
  );
}
