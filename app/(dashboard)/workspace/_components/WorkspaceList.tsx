"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

const colorCombinations = [
  "bg-blue-500 hover:bg-blue-600 text-white",
  "bg-emerald-500 hover:bg-emerald-600 text-white",
  "bg-purple-500 hover:bg-purple-600 text-white",
  "bg-amber-500 hover:bg-amber-600 text-white",
  "bg-rose-500 hover:bg-rose-600 text-white",
  "bg-indigo-500 hover:bg-indigo-600 text-white",
  "bg-cyan-500 hover:bg-cyan-600 text-white",
  "bg-sky-500 hover:bg-sky-600 text-white",
  "bg-lime-500 hover:bg-lime-600 text-white",
  "bg-pink-500 hover:bg-pink-600 text-white",
];

const getWorkspaceColor = (id: string) => {
  const charSum = id
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colorCombinations[charSum % colorCombinations.length];
};

export function WorkspaceList() {
  const {
    data: { workspaces, currentWorkspace },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        {workspaces.map((workspace) => {
          const isActive = workspace.id === currentWorkspace?.orgCode;
          return (
            <Tooltip key={workspace.id}>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  className={cn(
                    "size-12 transition-all duration-200",
                    getWorkspaceColor(workspace.id),
                    isActive ? "rounded-lg" :"rounded-xl hover:rounded-b-lg"
                  )}
                >
                  <span className="text-sm font-semibold">
                    {workspace.avatar.toUpperCase()}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>
                  {workspace.name} {isActive && "(Current)"}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

//   {workspaces.map((workspace) => (
//           <div key={workspace.id} className="flex items-center gap-2">
//             <div className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
//                 <span className="text-sm font-medium leading-none text-muted-foreground">
//                   {workspace.avatar}
//                 </span>
//               </div>
//               <span className="text-sm font-medium leading-none">
//                 {workspace.name}
//               </span>
//             </div>
//           </div>
//         ))}
