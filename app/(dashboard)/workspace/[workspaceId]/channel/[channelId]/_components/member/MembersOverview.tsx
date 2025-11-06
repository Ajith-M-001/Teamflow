import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { useState } from "react";
import { MembersItem } from "./MembersItem";
import { Skeleton } from "@/components/ui/skeleton";

export function MembersOverview() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, error } = useQuery(
    orpc.workspace.member.list.queryOptions()
  );

  const members = data ?? [];

  const query = search.trim().toLowerCase();

  const filteredMembers = query
    ? members.filter((member) => {
        const name = member.full_name?.toLowerCase() ?? "";
        const email = member.email?.toLowerCase() ?? "";
        return name.includes(query) || email.includes(query);
      })
    : members;

  console.log(data);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"}>
          <Users />
          <span>Members</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-sm">
        <div className="p-0">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Workspace Members</h3>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>

          {/* search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="search members.."
                className="pl-9 h-8"
              />
            </div>
          </div>

          {/* Members */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3 p-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="p-3 text-sm text-destructive">{error.message}</p>
            ) : filteredMembers?.length ? (
              filteredMembers.map((member) => (
                <MembersItem member={member} key={member.id} />
              ))
            ) : (
              <p className="p-3 text-sm text-muted-foreground">
                No members found.
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
