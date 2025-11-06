import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export function MessageHoverToolbar() {
  return (
    <div className="absolute -right-2 -top-3 items-center gap-1 rounded-md">
      <Button>
        <Pencil />
      </Button>
    </div>
);                                        
}
