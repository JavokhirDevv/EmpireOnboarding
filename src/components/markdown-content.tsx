import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import type { Plugin } from "unified";

/**
 * Layout primitives available to page authors, as markdown container
 * directives. Everything else falls through to normal markdown.
 *
 *   ::::grid                        two columns on desktop, stacked on phones
 *   :::card[Label]{tone=dark}       a panel; tone picks the treatment
 *   ::::
 */
const CARD_TONES = ["dark", "soft", "high", "low", "step"] as const;

type Node = {
  type: string;
  name?: string;
  value?: string;
  attributes?: Record<string, string | null | undefined>;
  data?: { hName?: string; hProperties?: Record<string, unknown>; directiveLabel?: boolean };
  children?: Node[];
};

function walk(node: Node, visit: (node: Node, parent: Node | null, index: number) => void) {
  node.children?.forEach((child, index) => {
    visit(child, node, index);
    walk(child, visit);
  });
}

function plainText(node: Node): string {
  if (typeof node.value === "string") return node.value;
  return (node.children ?? []).map(plainText).join("");
}

/**
 * Anything that isn't one of our primitives goes back to the literal text it
 * was written as — otherwise ordinary prose like "8:00 EST" parses as a
 * directive and disappears from the page.
 */
function toLiteralText(node: Node): Node {
  const colons = node.type === "containerDirective" ? ":::" : node.type === "leafDirective" ? "::" : ":";
  const label = node.children?.length ? `[${node.children.map(plainText).join("")}]` : "";
  const entries = Object.entries(node.attributes ?? {}).filter(([, v]) => v != null);
  const attributes = entries.length
    ? `{${entries.map(([k, v]) => `${k}=${v}`).join(" ")}}`
    : "";
  return { type: "text", value: `${colons}${node.name ?? ""}${label}${attributes}` };
}

const remarkLayout: Plugin = () => (tree) => {
  walk(tree as Node, (node, parent, index) => {
    const isDirective =
      node.type === "containerDirective" ||
      node.type === "leafDirective" ||
      node.type === "textDirective";
    if (!isDirective) return;

    if (node.type === "containerDirective" && node.name === "grid") {
      node.data = { ...node.data, hName: "div", hProperties: { className: ["md-grid"] } };
      return;
    }

    if (node.type === "containerDirective" && node.name === "card") {
      const requested = node.attributes?.tone ?? "";
      const tone = (CARD_TONES as readonly string[]).includes(requested) ? requested : "soft";
      node.data = {
        ...node.data,
        hName: "div",
        hProperties: { className: ["md-card", `md-card--${tone}`] },
      };

      // `[Label]` becomes the card's heading rather than a paragraph.
      const label = node.children?.[0];
      if (label?.data?.directiveLabel) {
        label.data = {
          ...label.data,
          hName: "div",
          hProperties: { className: ["md-card__label"] },
        };
      }
      return;
    }

    if (parent?.children) {
      parent.children[index] = toLiteralText(node);
    }
  });
};

export function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkDirective, remarkLayout]}>
      {children}
    </ReactMarkdown>
  );
}
