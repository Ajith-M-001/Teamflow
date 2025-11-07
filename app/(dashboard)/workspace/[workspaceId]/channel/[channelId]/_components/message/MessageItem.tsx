import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { getAvatar } from "@/lib/get-avatar";
import { Message } from "@/prisma/generated/prisma";
import Image from "next/image";
import { MessageHoverToolbar } from "../toolbar";
import { useState } from "react";
import { EditMessage } from "../toolbar/EditMessage";
import { set } from "zod";

interface MessageItemProps {
  message: Message;
  currentUserId: string;
}
export function MessageItem({ message, currentUserId }: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
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
              onSave={() => {setIsEditing(false)}}
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
