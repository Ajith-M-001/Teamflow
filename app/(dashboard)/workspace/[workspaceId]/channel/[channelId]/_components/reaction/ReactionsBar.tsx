import { useMutation } from "@tanstack/react-query";
import { EmojiReaction } from "./EmojiReaction";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { GroupedReactionSchemaType } from "@/components/schemas/message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReactionBarProps {
  messageId: string;
  reactions: GroupedReactionSchemaType[];
}

export function ReactionsBar({ messageId, reactions }: ReactionBarProps) {
  const toggleMutation = useMutation(
    orpc.message.reaction.toggle.mutationOptions({
      onSuccess: (data) => {
        console.log(data);
        return toast.success("emoji added!");
      },
      onError: (err) => {
        console.error(err);
        return toast.error(err.message || "Error adding emoji");
      },
    })
  );

  const handleToggle = (emoji: string) => {
    toggleMutation.mutate({ emoji, messageId });
    console.log(emoji);
  };
  return (
    <div className="mt-1 flex items-center gap-1">
      {reactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          type="button"
          variant="secondary"
          size="icon"
          className={cn(
            "h-6 px-2 text-xs",
            reaction.reactedByMe && "bg-primary/10 border border-primary"
          )}
        >
          <span>{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}
      <EmojiReaction onSelect={handleToggle} />
    </div>
  );
}
