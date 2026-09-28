import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import type { Plugin } from "unified";

/**
 * Layout primitives available to page authors, as markdown container
 * directives. Everything else falls through to normal markdown.
 *
 *   ::::grid                        two columns on desktop, stacked on phones
 *   :::card{tone=dark}[Label]       a panel; tone picks the treatment
 *   ::::
 */
const CARD_TONES = ["dark", "soft", "high", "low", "step"] as const;

type Node = {
  type: string;
  name?: string;
  attributes?: Record<string, string | null | undefined>;
  data?: { hName?: string; hProperties?: Record<string, unknown>; directiveLabel?: boolean };
  children?: Node[];
};

function walk(node: Node, visit: (node: Node) => void) {
  visit(node);
  node.children?.forEach((child) => walk(child, visit));
}

/** Turns the container directives above into plain divs with stable class names. */
const remarkLayout: Plugin = () => (tree) => {
  walk(tree as Node, (node) => {
    if (node.type !== "containerDirective") return;

    if (node.name === "grid") {
      node.data = { ...node.data, hName: "div", hProperties: { className: ["md-grid"] } };
      return;
    }

    if (node.name === "card") {
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
