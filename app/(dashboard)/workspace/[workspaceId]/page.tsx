import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { client } from "@/lib/orpc";
import { Tv } from "lucide-react";
import { redirect } from "next/navigation";
import { CreateNewChannel } from "./_components/CreateNewChannel";

interface workspaceByIdPageParams {
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceByIdPage = async ({ params }: workspaceByIdPageParams) => {
  const { workspaceId } = await params;
  const { channels } = await client.channel.list();
  if (channels.length > 0) {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`);
  }
  return (
    <div className="p-16 flex flex-1">
      <Empty className="border border-dashed from-muted/50 to-background h-full bg-accent from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Tv />
          </EmptyMedia>
          <EmptyTitle>No Channels Yet!</EmptyTitle>
          <EmptyDescription>
            Create your first channel to get started!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateNewChannel />
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default WorkspaceByIdPage;
