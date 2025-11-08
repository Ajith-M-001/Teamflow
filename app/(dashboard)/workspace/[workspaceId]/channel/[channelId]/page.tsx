"use client";
import React from "react";
import { ChannelHeader } from "./_components/ChannelHeader";
import { MessageList } from "./_components/MessageList";
import { MessageInputForm } from "./_components/message/MessageInputForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ThreadSidebar } from "./_components/thread/ThreadSidebar";
import { ThreadProvider, useThread } from "@/providers/threadProvider";

const ChannelPageMain = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { isThreadOpen } = useThread();
  const { data, error, isLoading } = useQuery(
    orpc.channel.get.queryOptions({ input: { channelId } })
  );

  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex h-screen w-full">
      {/* Main Channel Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Fixed Header */}
        {isLoading ? (
          <div className="flex justify-between items-center h-14 px-4 border-b">
            <Skeleton className="h-7 w-40" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="size-8" />
            </div>
          </div>
        ) : (
          <>
            <ChannelHeader
              channelName={data?.channelName ?? "Unknown Channel"}
            />
          </>
        )}

        {/* scrollable messages ares */}
        <div className="flex-1 overflow-hidden mb-4">
          <MessageList />
        </div>

        {/* Fixed Input */}
        <div className="border-t bg-background p-4">
          <MessageInputForm
            user={data?.currentUser as KindeUser<Record<string, unknown>>}
            channelId={channelId}
          />
        </div>
      </div>

      {isThreadOpen && (
        <ThreadSidebar
          user={data?.currentUser as KindeUser<Record<string, unknown>>}
        />
      )}
    </div>
  );
};

const ThisIsTheChannelPage = () => {
  return (
    <ThreadProvider>
      <ChannelPageMain />
    </ThreadProvider>
  );
};

export default ThisIsTheChannelPage;
