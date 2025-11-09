import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { getAvatar } from "@/lib/get-avatar";
import { MessageListItem } from "@/lib/types";
import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { MessageHoverToolbar } from "../toolbar";
import { EditMessage } from "../toolbar/EditMessage";
import { useThread } from "@/providers/threadProvider";
import { orpc } from "@/lib/orpc";
import { useQueryClient } from "@tanstack/react-query";
import { ReactionsBar } from "../reaction/ReactionsBar";

interface MessageItemProps {
  message: MessageListItem;
  currentUserId: string;
}
export function MessageItem({ message, currentUserId }: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { openThread } = useThread();
  const queryClient = useQueryClient();

  const prefetchThread = useCallback(() => {
    const options = orpc.message.thread.list.queryOptions({
      input: {
        messageId: message.id,
      },
    });

    queryClient
      .prefetchQuery({ ...options, staleTime: 60_000 })
      .catch(() => {});
  }, [message.id, queryClient]);

  return (
    <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50">
      <Image
        className="size-8 rounded-lg"
        src={getAvatar(message.authorAvatar, message.authorEmail)}
        alt={`${message.authorName}'s avatar`}
        width={32}
        height={32}
      />
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-x-2 ">
          <p className="font-medium leading-none">{message.authorName}</p>
          <p className="text-xs text-muted-foreground leading-none">
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(message.createdAt)}{" "}
            {new Intl.DateTimeFormat("en-GB", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }).format(message.createdAt)}
          </p>
        </div>
        {isEditing ? (
          <>
            <EditMessage
              onSave={() => {
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
              message={message}
            />
          </>
        ) : (
          <>
            <SafeContent
              className="text-sm prose  wrap-break-word dark:prose-invert max-w-none marker:text-primary"
              content={JSON.parse(message.content)}
            />{" "}
            {message.imageUrl && (
              <div className="mt-3">
                <Image
                  src={message.imageUrl}
                  alt="Message image"
                  width={512}
                  height={512}
                  className=" rounded-md max-h-80 w-auto object-contain"
                />
              </div>
            )}
            {/* Reactions */}
            <ReactionsBar
              context={{ type: "list", channelId: message.channelId! }}
              reactions={message.reactions}
              messageId={message.id}
            />
            {message?.repliesCount > 0 && (
              <button
                onMouseEnter={prefetchThread}
                onFocus={prefetchThread}
                onClick={() => openThread(message.id)}
                type="button"
                className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border"
              >
                <MessagesSquare className="w-4 h-4" />
                <span>
                  {message.repliesCount}{" "}
                  {message.repliesCount === 1 ? "reply" : "replies"}
                </span>
              </button>
            )}
          </>
        )}
      </div>
      <MessageHoverToolbar
        messageId={message.id}
        canEdit={message.authorId === currentUserId}
        onEdit={() => setIsEditing(true)}
      />
    </div>
  );
}
