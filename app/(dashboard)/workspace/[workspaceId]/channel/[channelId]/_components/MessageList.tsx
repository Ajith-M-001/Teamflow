"use client";

import { orpc } from "@/lib/orpc";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { MessageItem } from "./message/MessageItem";

export function MessageList() {
  const { channelId } = useParams<{ channelId: string }>();

  const infiniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParams: string | undefined) => ({
      channelId: channelId,
      cursor: pageParams,
      limit: 30,
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
  } = useInfiniteQuery({
    ...infiniteOptions,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4">
        {items?.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}
