import { Button } from "@/components/ui/button";
import { ChevronDown, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { ThreadReply } from "./ThreadReply";
import { ThreadReplyForm } from "./ThreadReplyForm";
import { useThread } from "@/providers/threadProvider";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { ThreadSidebarSkeleton } from "./ThreadSidebarSkeleton";
import { useEffect, useRef, useState } from "react";
import { SummarizeThread } from "./SummarizeThread";

interface ThreadSidebarProps {
  user: KindeUser<Record<string, unknown>>;
}

export function ThreadSidebar({ user }: ThreadSidebarProps) {
  const { selectedThreadId, closeThread } = useThread();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const lastMessageCountRef = useRef(0);
  const { data, isLoading } = useQuery(
    orpc.message.thread.list.queryOptions({
      input: {
        messageId: selectedThreadId!,
      },
      enabled: !!selectedThreadId,
    })
  );

  const messageCount = data?.messages.length ?? 0;

  const isNearBottom = (el: HTMLDivElement) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 80;
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setIsAtBottom(isNearBottom(el));
  };

  useEffect(() => {
    if (messageCount === 0) return;
    const prevMessageCount = lastMessageCountRef.current;
    const el = scrollRef.current;
    if (prevMessageCount > 0 && messageCount !== prevMessageCount) {
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({
            block: "end",
            behavior: "smooth",
          });
        });
        setIsAtBottom(true);
      }
    }

    lastMessageCountRef.current = messageCount;
  }, [messageCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({
            block: "end",
            behavior: "smooth",
          });
        });
      }
    };

    const onImageLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        scrollToBottomIfNeeded();
      }
    };

    el.addEventListener("load", onImageLoad, true);

    //resize observer watch for size changes in the container
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfNeeded();
    });

    resizeObserver.observe(el);

    //mutation observer watch for DOM changes
    const mutationObserver = new MutationObserver(() => {
      scrollToBottomIfNeeded();
    });

    mutationObserver.observe(el, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      el.removeEventListener("load", onImageLoad, true);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isAtBottom]);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;

    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });

    setIsAtBottom(true);
  };

  if (isLoading) return <ThreadSidebarSkeleton />;
  return (
    <div className="w-120 border-l flex flex-col h-full">
      {/* header */}
      <div className="border-b h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 " />
          <span>Thread</span>
        </div>
        <div className="flex items-center gap-2">
          <SummarizeThread messageId={selectedThreadId!} />
          <Button
            onClick={closeThread}
            type="button"
            size="icon"
            variant="outline"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 relative overflow-y-auto ">
        <div
          className="h-full overflow-y-auto"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {data && (
            <>
              <div className="p-4 border-b bg-muted/20">
                <div className="flex  gap-2">
                  <Image
                    src={data.parent.authorAvatar}
                    alt="author image"
                    width={32}
                    height={32}
                    className="size-8 rounded-full shrink-0"
                  />
                  <div className="flex-1 space-y-1 min-w-0 ">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {data.parent.authorName}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {new Intl.DateTimeFormat("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                          month: "short",
                          day: "numeric",
                        }).format(data.parent.createdAt)}
                      </span>
                    </div>

                    <SafeContent
                      className="marker:text-primary text-sm wrap-break-word prose dark:prose-invert max-w-none"
                      content={JSON.parse(data.parent.content)}
                    />
                  </div>
                </div>
              </div>
              {/* thread replies */}
              <div className="p-2">
                <p className="text-xs text-muted-foreground mb-3 px-2">
                  {data.messages.length} replies
                </p>

                <div className="space-y-1 ">
                  {data.messages.map((reply) => (
                    <ThreadReply selectedThreadId={selectedThreadId!} key={reply.id} message={reply} />
                  ))}
                </div>
              </div>

              <div ref={bottomRef}></div>
            </>
          )}
        </div>
        {/* scroll to bottom button */}

        {!isAtBottom && (
          <Button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-5 z-10 rounded-full hover:shadow-xl transition-all duration-100"
            type="button"
            size={"sm"}
          >
            <ChevronDown className="size-4" />
          </Button>
        )}
        <div></div>
      </div>

      {/* Thread reply form */}
      <div className="border-t p-4">
        <ThreadReplyForm user={user} threadId={selectedThreadId!} />
      </div>
    </div>
  );
}
