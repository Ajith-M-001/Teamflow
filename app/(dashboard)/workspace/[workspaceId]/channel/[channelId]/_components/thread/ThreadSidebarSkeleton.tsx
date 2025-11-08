import { Skeleton } from "@/components/ui/skeleton";

export function ThreadSidebarSkeleton() {
  return (
    <div className="w-120 border-l flex flex-col h-full">
      <div className="border-b h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6" />
          <Skeleton className="w-20 h-6" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-8" />
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 overflow-y-auto ">
        <div className="p-4 border-b bg-muted/20">
          <div className="flex  gap-2">
            <Skeleton className="size-8" />
            <div className="flex-1 space-y-1 min-w-0 ">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  <Skeleton className="w-20 h-6" />
                </span>
                <span className="text-muted-foreground text-xs">
                  <Skeleton className="w-25 h-6" />
                </span>
              </div>

              <Skeleton className="w-full h-6" />
            </div>
          </div>
        </div>
        {/* thread replies */}
        <div className="p-2">
          <div className="text-xs text-muted-foreground mb-3 px-2">
            <Skeleton className="size-0.5" /> replies
          </div>

          <div className="space-y-1 ">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-2">
                <Skeleton className="size-8" />
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">
                      <Skeleton className="w-20 h-6" />
                    </span>
                    <span className="text-muted-foreground text-xs">
                      <Skeleton className="w-25 h-6" />
                    </span>
                  </div>
                  <Skeleton className="w-full h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thread reply form */}
      <div className="border-t p-4">
         <Skeleton className="w-full h-56" />
      </div>
    </div>
  );
}
