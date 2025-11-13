import { baseExtensions } from "@/components/rich-text-editor/extension";
import { renderToMarkdown } from "@tiptap/static-renderer/pm/markdown";

/**
 * Normalize whitespace in markdown text:
 * - Trim trailing spaces at line ends
 * - Collapse >2 blank lines into just 2
 * - Trim overall string
 */
function normalizeWhitespace(markdown: string) {
  return markdown
    .replace(/[ \t]+$/gm, "") // remove trailing spaces per line
    .replace(/\n{3,}/g, "\n\n") // collapse 3+ blank lines
    .trim();
}

/**
 * Converts a TipTap JSON document to Markdown.
 * Returns an empty string if parsing or rendering fails.
 */
export function jsonToMarkdown(json: string): string {
  try {
    const content = JSON.parse(json);

    const markdown = renderToMarkdown({
      extensions: baseExtensions,
      content,
    });

    return normalizeWhitespace(markdown);
  } catch (error) {
    console.error("Failed to convert JSON to Markdown:", error);
    return "";
  }
}
