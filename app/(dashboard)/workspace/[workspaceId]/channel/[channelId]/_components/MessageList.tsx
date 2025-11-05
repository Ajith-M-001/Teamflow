"use client";

import { orpc } from "@/lib/orpc";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageItem } from "./message/MessageItem";
import { nullable } from "zod";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/general/EmptyState";
import { ChevronDown, Loader2 } from "lucide-react";

export function MessageList() {
  const { channelId } = useParams<{ channelId: string }>();
  const [hasInitialScrolled, setHasInitialScrolled] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastItemRef = useRef<string | undefined>(undefined);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [newMessages, setNewMessages] = useState<boolean>(false);

  const infiniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParams: string | undefined) => ({
      channelId: channelId,
      cursor: pageParams,
      limit: 5,
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: [...data.pages]
        .map((page) => ({
          ...page,
          items: [...page.items].reverse(),
        }))
        .reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isFetching,
  } = useInfiniteQuery({
    ...infiniteOptions,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  //scroll to the bottom when messages first load
  useEffect(() => {
    if (!hasInitialScrolled && data?.pages.length) {
      const el = scrollRef.current;
      if (el) {
        bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
        setHasInitialScrolled(true);
        setIsAtBottom(true);
      }
    }
  }, [hasInitialScrolled, data?.pages.length]);

  //keep view pinned to bottom to late content growth (e.g images)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom || !hasInitialScrolled) {
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
  }, [isAtBottom, hasInitialScrolled]);

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const isEmpty = !isLoading && !error && items?.length === 0;

  const isNearBottom = (el: HTMLDivElement) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 80;
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
      const prevScrollHeight = el.scrollHeight;
      const prevScrollTop = el.scrollTop;
      fetchNextPage().then(() => {
        const newScrollHeight = el.scrollHeight;
        el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
      });
    }

    setIsAtBottom(isNearBottom(el));
  };

  useEffect(() => {
    if (!items?.length) return;

    const lastId = items[items.length - 1].id;

    const prevLastId = lastItemRef.current;
    const el = scrollRef.current;

    if (prevLastId && lastId !== prevLastId) {
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });

        setNewMessages(false);
        setIsAtBottom(true);
      } else {
        setNewMessages(true);
      }
    }

    lastItemRef.current = lastId;
  }, [items]);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;

    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });

    setNewMessages(false);
    setIsAtBottom(true);
  };

  return (
    <div className="relative h-full">
      <div
        className="h-full overflow-y-auto px-4 flex flex-col space-y-1"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {isEmpty ? (
          <div className="flex h-full pt-4">
            <EmptyState
              title="No messages yet"
              description="start the conversation by sending the first message"
              buttonText="Send a message"
              href="#"
            />
          </div>
        ) : (
          items?.map((msg) => <MessageItem key={msg.id} message={msg} />)
        )}

        <div ref={bottomRef}></div>
      </div>

      {isFetchingNextPage && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-2">
          <div className="flex text-center gap-2 rounded-md bg-linear-to-b from-white/10 to-transparent dark:from-neutral-900/80 backdrop-blur px-3 py-1">
            <Loader2 className=" h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Loading more...
            </span>
          </div>
        </div>
      )}

      {/* {newMessages && !isAtBottom ? (
        <Button
          onClick={scrollToBottom}
          type="button"
          className="absolute bottom-4 right-8 rounded-full "
        >
          New Messages
        </Button>
      ) : null} */}

      {(!isAtBottom || newMessages) && (
        <Button 
          onClick={scrollToBottom}
          className="absolute bottom-4 right-5 z-10 rounded-full hover:shadow-xl transition-all duration-100"
          type="button"
          size={"sm"}
        >
          <ChevronDown className="size-4" />
        </Button>
      )}
    </div>
  );
}
