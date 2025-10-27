import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogoutLink,
  PortalLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { CreditCard, LogOutIcon, User } from "lucide-react";

const user = {
  picture: "https://github.com/shadcn.png",
  given_name: "Jan Martin",
};

function UserAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses =
    size === "sm" ? "size-8" : size === "lg" ? "size-16" : "size-12"; // default "md"

  return (
    <Avatar className={sizeClasses}>
      <AvatarImage
        src={user.picture}
        alt={`${user.given_name}'s profile picture`}
        className="object-cover"
      />
      <AvatarFallback>
        {user.given_name.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-border/50 hover:bg-accent hover:text-accent-foreground"
        >
          <UserAvatar />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[200px]"
        align="end"
        side="right"
        sideOffset={12}
      >
        <DropdownMenuLabel className="flex items-center gap-3">
          <UserAvatar size="sm" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="font-medium truncate">{user.given_name}</span>
            <p className="truncate text-xs font-light text-muted-foreground">
              test@gmail.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <PortalLink>
              <User />
              <span>Account</span>
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink>
            <LogOutIcon />
            <span>Logout</span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
