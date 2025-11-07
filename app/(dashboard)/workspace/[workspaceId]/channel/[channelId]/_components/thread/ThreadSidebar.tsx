import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { ThreadReply } from "./ThreadReply";

const messages = [
  {
    id: "1",
    authorName: "John Doe",
    authorImage: "https://avatars.githubusercontent.com/u/76267404?v=4",
    content: "Hello, world! 👋",
    createdAt: new Date("2025-11-07T10:00:00Z"),
  },
  {
    id: "2",
    authorName: "Sarah Kim",
    authorImage: "https://avatars.githubusercontent.com/u/76267404?v=4",
    content: "Hey everyone! Excited to get started on the new project 🚀",
    createdAt: new Date("2025-11-07T10:05:00Z"),
  },
  {
    id: "3",
    authorName: "Liam Nguyen",
    authorImage: "https://avatars.githubusercontent.com/u/76267404?v=4",
    content:
      "I’ve pushed some updates to the repo — please review when you can.",
    createdAt: new Date("2025-11-07T10:15:00Z"),
  },
  {
    id: "4",
    authorName: "Emily Carter",
    authorImage: "https://avatars.githubusercontent.com/u/76267404?v=4",
    content: "Looks good to me! 👍 I’ll merge it in a bit.",
    createdAt: new Date("2025-11-07T10:18:00Z"),
  },
  {
    id: "5",
    authorName: "Noah Patel",
    authorImage: "https://avatars.githubusercontent.com/u/76267404?v=4",
    content:
      "Quick question — are we using Tailwind or styled-components for this UI?",
    createdAt: new Date("2025-11-07T10:22:00Z"),
  },
  {
    id: "6",
    authorName: "Ava Johnson",
    authorImage: "https://avatars.githubusercontent.com/u/76267404?v=4",
    content:
      "Tailwind for now, but we can modularize components later if needed 💅",
    createdAt: new Date("2025-11-07T10:25:00Z"),
  },
];

export function ThreadSidebar() {
  return (
    <div className="w-120 border-l flex flex-col h-full">
      {/* header */}
      <div className="border-b h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 " />
          <span>Thread</span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="icon" variant="outline">
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 overflow-y-auto ">
        <div className="p-4 border-b bg-muted/20">
          <div className="flex  gap-2">
            <Image
              src={messages[0].authorImage}
              alt="author image"
              width={32}
              height={32}
              className="size-8 rounded-full shrink-0"
            />
            <div className="flex-1 space-y-1 min-w-0 ">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {messages[0].authorName}
                </span>
                <span className="text-muted-foreground text-xs">
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    month: "short",
                    day: "numeric",
                  }).format(messages[0].createdAt)}
                </span>
              </div>

              <p className="text-sm wrap-break-word prose dark:prose-invert max-w-none">
                {messages[0].content}
              </p>
            </div>
          </div>
        </div>
        {/* thread replies */}
        <div className="p-2">
          <p className="text-xs text-muted-foreground mb-3 px-2">
            {messages.length} replies
          </p>

          <div className="space-y-1 ">
            {messages.map((reply) => (
              <ThreadReply key={reply.id} message={reply} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
