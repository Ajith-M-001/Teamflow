import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Image, ImageIcon, Send } from "lucide-react";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
}
export function MessageComposer({ onChange, value }: MessageComposerProps) {
  return (
    <>
      <RichTextEditor
        field={{ onChange, value }}
        sendButton={
          <Button type="button" size="sm">
            <Send className="size-4 mr-1" />
            <span>Send</span>
          </Button>
        }
        footerLeft={
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <ImageIcon className="size-4 mr-1" />
              <span>Attach</span>
            </Button>
          </div>
        }
      />
    </>
  );
}
