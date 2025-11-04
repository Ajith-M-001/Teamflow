import { UploadDropzone } from "@/lib/uploadthing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: (url: string) => void;
}

export function ImageUploadModal({
  open,
  onOpenChange,
  onUploaded,
}: ImageUploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <UploadDropzone
          className="ut-uploading:opacity-90 ut-ready:bg-card ut-ready:border-border ut-ready:text-foreground ut-uploading:bg-muted ut-uploading:border-border ut-uploading:text-muted-foreground ut-label:text-sm ut-label:text-muted-foreground ut-allowed-content:text-xs ut-allowed-content:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/50 ut-upload-icon:text-muted-foreground ut-error:text-destructive ut-error:ring-destructive/20 dark:ut-error:ring-destructive/40 ut-error:border-destructive"
          appearance={{
            container: "bg-card",
            label: "text-muted-foreground",
            allowedContent: "text-xs text-muted-foreground",
            button: "bg-primary text-primary-foreground hover:bg-primary/50",
            uploadIcon: "text-muted-foreground",
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const url = res[0].ufsUrl;
            onUploaded(url);
            toast.success("Image uploaded successfully!");
          }}
          onUploadError={(error) => {
            toast.error(
              error.message || "Error uploading image, please try again!"
            );
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
