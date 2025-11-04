import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { ImageUploadModal } from "@/components/rich-text-editor/ImageUploadModal";
import { Button } from "@/components/ui/button";
import { useAttachmentUploadType } from "@/hooks/use-attachment-upload";
import { Image, ImageIcon, Send } from "lucide-react";
import { AttachmentChip } from "./AttachmentChip";
interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  upload: useAttachmentUploadType;
}
export function MessageComposer({
  upload,
  onChange,
  value,
  onSubmit,
  isSubmitting,
}: MessageComposerProps) {
  return (
    <>
      <RichTextEditor
        field={{ onChange, value }}
        sendButton={
          <Button
            disabled={isSubmitting}
            type="button"
            size="sm"
            onClick={onSubmit}
          >
            <Send className="size-4 mr-1" />
            <span>Send</span>
          </Button>
        }
        footerLeft={
          upload.stagedUrl ? (
            <AttachmentChip url={upload.stagedUrl} onRemove={upload.clearImage} />
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                onClick={() => upload.setIsOpen(true)}
                size="sm"
                variant="outline"
              >
                <ImageIcon className="size-4 mr-1" />
                <span>Attach</span>
              </Button>
            </div>
          )
        }
      />

      <ImageUploadModal
        onUploaded={(url) => upload.onUploaded(url)}
        open={upload.isOpen}
        onOpenChange={upload.setIsOpen}
      />
    </>
  );
}
