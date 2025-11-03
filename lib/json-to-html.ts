import { baseExtensions } from "@/components/rich-text-editor/extension";
import { generateHTML, type JSONContent } from "@tiptap/react";

export const convertJsonToHtml = (jsonContent: JSONContent): string => {
  try {
    const content =
      typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;

    return generateHTML(content, baseExtensions);
  } catch (error) {
    console.error(error);
    return "";
  }
};
