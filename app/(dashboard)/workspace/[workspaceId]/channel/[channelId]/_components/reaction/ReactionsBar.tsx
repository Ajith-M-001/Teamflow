import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { EmojiReaction } from "./EmojiReaction";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { GroupedReactionSchemaType } from "@/components/schemas/message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { MessageListItem } from "@/lib/types";

type ThreadContext = { type: "thread"; threadId: string };
type ListContext = { type: "list"; channelId: string };

interface ReactionBarProps {
  messageId: string;
  reactions: GroupedReactionSchemaType[];
  context?: ThreadContext | ListContext;
}

type MessagePage = {
  items: MessageListItem[];
  nextCursor?: string;
};

type infiniteMessages = InfiniteData<MessagePage>;

export function ReactionsBar({
  messageId,
  reactions,
  context,
}: ReactionBarProps) {
  const { channelId } = useParams<{ channelId: string }>();
  const queryClient = useQueryClient();
  const toggleMutation = useMutation(
    orpc.message.reaction.toggle.mutationOptions({
      onMutate: async (vars: { emoji: string; messageId: string }) => {
        const bump = (rxns: GroupedReactionSchemaType[]) => {
          const found = rxns.find((r) => r.emoji === vars.emoji);

          if (found) {
            const dec = found.count - 1;
            return dec <= 0
              ? rxns.filter((r) => r.emoji !== found.emoji)
              : rxns.map((r) =>
                  r.emoji === found.emoji
                    ? { ...r, count: dec, reactedByMe: false }
                    : r
                );
          }

          return [...rxns, { emoji: vars.emoji, count: 1, reactedByMe: true }];
        };
        const isThread = context?.type === "thread";

        if (isThread) {
          const listOptions = orpc.message.thread.list.queryOptions({
            input: {
              messageId: context.threadId,
            },
          });

          await queryClient.cancelQueries({ queryKey: listOptions.queryKey });

          const prevThread = queryClient.getQueryData(listOptions.queryKey);

          queryClient.setQueryData(listOptions.queryKey, (old) => {
            if (!old) return old;
            if (vars.messageId === context.threadId) {
              return {
                ...old,
                parent: {
                  ...old.parent,
                  reactions: bump(old.parent.reactions),
                },
              };
            }

            return {
              ...old,
              messages: old.messages.map((m) =>
                m.id === vars.messageId
                  ? {
                      ...m,
                      reactions: bump(m.reactions),
                    }
                  : m
              ),
            };
          });

          return { prevThread, threadQueryKey: listOptions.queryKey };
        }

        const listKey = ["messages.list", channelId];

        await queryClient.cancelQueries({ queryKey: listKey });

        const previous = queryClient.getQueryData(listKey);

        queryClient.setQueryData<infiniteMessages>(listKey, (old) => {
          if (!old) return old;

          const pages = old.pages.map((page) => ({
            ...page,
            items: page.items.map((m) => {
              if (m.id !== messageId) return m;
              const current = m.reactions;
              const next = bump(current);
              return {
                ...m,
                reactions: next,
              };
            }),
          }));

          return {
            ...old,
            pages,
          };
        });

        return { previous, listKey };
      },
      onSuccess: (data) => {
        console.log(data);
        return toast.success("emoji added!");
      },
      onError: (_err, _vars, ctx) => {
        if(ctx?.prevThread && ctx.threadQueryKey) {
          queryClient.setQueryData(ctx.threadQueryKey, ctx.prevThread);
        }
        if (ctx?.previous && ctx.listKey) {
          queryClient.setQueryData(ctx.listKey, ctx.previous);
        }
      },
    })
  );

  const handleToggle = (emoji: string) => {
    toggleMutation.mutate({ emoji, messageId });
    console.log(emoji);
  };
  return (
    <div className="mt-1 flex items-center gap-1">
      {reactions?.map((reaction) => (
        <Button
          onClick={() => handleToggle(reaction.emoji)}
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
