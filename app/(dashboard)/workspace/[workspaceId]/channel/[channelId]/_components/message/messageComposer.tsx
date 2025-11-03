import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Image, ImageIcon, Send } from "lucide-react";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void
  isSubmitting?: boolean
}
export function MessageComposer({ onChange, value , onSubmit , isSubmitting}: MessageComposerProps) {
  return (
    <>
      <RichTextEditor
        field={{ onChange, value }}
        sendButton={
          <Button disabled={isSubmitting} type="button" size="sm" onClick={onSubmit}>
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
