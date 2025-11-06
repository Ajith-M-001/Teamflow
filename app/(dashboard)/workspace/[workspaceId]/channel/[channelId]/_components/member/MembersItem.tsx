import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatar } from "@/lib/get-avatar";
import { organization_user } from "@kinde/management-api-js";
import Image from "next/image";

interface MembersItemProps {
  member: organization_user;
}
export function MembersItem({ member }: MembersItemProps) {
  return (
    <div className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors">
      <div className="flex items-center space-x-3 ">
        <div className="relative">
          <Avatar className="size-8">
            <Image
              src={getAvatar(member?.picture ?? null, member.email!)}
              alt="Avatar"
              fill
              className="object-cover"
            />
            <AvatarFallback>
              {member.full_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        {/* member info */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">
              {member.full_name ?? member.first_name ?? "Unknown"}
            </p>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
              Admin
            </span>
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {member.email}
          </span>
        </div>
      </div>
    </div>
  );
}
