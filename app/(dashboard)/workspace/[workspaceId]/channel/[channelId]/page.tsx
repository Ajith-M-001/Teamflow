"use client";
import React from "react";
import { ChannelHeader } from "./_components/ChannelHeader";
import { MessageList } from "./_components/MessageList";
import { MessageInputForm } from "./_components/message/MessageInputForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const ChannelPageMain = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const {data , error , isLoading} = useQuery(orpc.channel.get.queryOptions({ input: { channelId } }));
 
  if(isLoading) return <div>Loading...</div>
  if(error) return <div>{error.message}</div>
 
  return (
    <div className="flex h-screen w-full">
      {/* Main Channel Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Fixed Header */}
        <ChannelHeader channelName={data?.channelName ?? "Unknown Channel"} />

        {/* scrollable messages ares */}
        <div className="flex-1 overflow-hidden mb-4">
          <MessageList />
        </div>

        {/* Fixed Input */}
        <div className="border-t bg-background p-4">
          <MessageInputForm user={data?.currentUser as KindeUser<Record<string, unknown>>} channelId={channelId} />
        </div>
      </div>
    </div>
  );
};

export default ChannelPageMain;
