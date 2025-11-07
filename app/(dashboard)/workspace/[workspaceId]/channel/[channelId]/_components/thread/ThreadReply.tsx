import Image from "next/image";
import React from "react";

interface ThreadReplyProps {
  message: {
    id: string;
    authorName: string;
    authorImage: string;
    content: string;
    createdAt: Date;
  };
}

export function ThreadReply({ message }: ThreadReplyProps) {
  return (
    <div className="flex space-x-3 p-3 hover:bg-muted/30 rounded-lg">
      <Image
        className="size-8 rounded-full shrink-0"
        src={message.authorImage}
        alt="Author"
        width={32}
        height={32}
      />
      <div className="flex-1 space-y-1 min-w-0 ">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">{message.authorName}</span>
          <span className="text-muted-foreground text-xs">
            {new Intl.DateTimeFormat("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              month: "short",
              day: "numeric",
            }).format(message.createdAt)}
          </span>
        </div>

        <p className="text-sm wrap-break-word prose dark:prose-invert max-w-none">
          {message.content}
        </p>
      </div>
    </div>
  );
}
