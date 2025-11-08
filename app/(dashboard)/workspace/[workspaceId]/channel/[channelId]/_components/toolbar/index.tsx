import { Button } from "@/components/ui/button";
import { useThread } from "@/providers/threadProvider";
import { MessageSquareText, Pencil } from "lucide-react";

interface toolbarProps {
  messageId: string;
  canEdit: boolean;
  onEdit: () => void;
}

export function MessageHoverToolbar({
  canEdit,
  messageId,
  onEdit,
}: toolbarProps) {
  const { toggleThread } = useThread();
  return (
    <div className="absolute -right-2 top-0 items-center gap-1 rounded-md border border-gray-200 bg-white/95 px-1.5 py-1 shadow-sm backdrop-blue transition-opacity opacity-0 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-900/90">
      {canEdit && (
        <Button onClick={onEdit} type="button" size="icon" variant="ghost">
          <Pencil className="size-4" />
        </Button>
      )}

      <Button onClick={()=>toggleThread(messageId)} type="button" size="icon" variant="ghost">
        <MessageSquareText className="size-4" />
      </Button>
    </div>
  );
}
