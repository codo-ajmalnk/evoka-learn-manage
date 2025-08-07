import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, User } from "lucide-react";
import { memo } from "react";

interface UserMenuProps {
  user: any;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const UserMenu = memo(({ user, onNavigate, onLogout }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 sm:gap-3 h-auto py-2 px-2 sm:px-3 rounded-xl hover:bg-accent/80 hover:scale-105 transition-all duration-200 shadow-sm border border-border/30 touch-manipulation"
        >
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 ring-2 ring-primary/20 ring-offset-2 ring-offset-background shadow-md">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold shadow-lg text-xs sm:text-sm">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden lg:block min-w-0">
            <p className="text-sm font-semibold tracking-wide truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground capitalize font-medium truncate">
              {user.role || "user"}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-card/95 backdrop-blur-lg border-border/50 shadow-xl rounded-xl"
      >
        <DropdownMenuLabel className="font-semibold text-foreground px-4 py-3">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={() => onNavigate("/profile")}
          className="hover:bg-accent/80 transition-colors duration-200 rounded-lg mx-2 my-1 font-medium py-3"
        >
          <User className="mr-3 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("/notifications")}
          className="hover:bg-accent/80 transition-colors duration-200 rounded-lg mx-2 my-1 font-medium py-3"
        >
          <Bell className="mr-3 h-4 w-4" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 rounded-lg mx-2 my-1 font-medium py-3"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

UserMenu.displayName = "UserMenu"; 