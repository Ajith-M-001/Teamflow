"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatar } from "@/lib/get-avatar";
import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";

export function WorkspaceMembersList() {
  const { data :{ members} } = useSuspenseQuery(orpc.channel.list.queryOptions());
  return (
    <div className="space-y-0.5 py-1 ">
      {members.map((member) => (
        <div key={member.id} className="flex items-center  px-3 py-2 hover:bg-accent cursor-pointer transition-colors space-x-3">
          <div className="relative">
            <Avatar className="size-8 relative">
              <AvatarImage
                src={getAvatar(member.picture ?? null, member.email ?? "unknown@user.com")}
                alt={`${member.full_name} image`}
                className="object-cover"
              />
              <AvatarFallback>
                {member.full_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
