import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Bell, LogOut, Search, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications] = useState(3); // Dummy notification count

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 lg:h-18 border-b border-border/30 bg-card/80 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
            <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <SidebarTrigger className="hover:bg-accent/80 hover:scale-105 transition-all duration-200 rounded-lg p-2 flex-shrink-0" />

                {/* Search Bar */}
                <div className="relative flex-1 max-w-md hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search students, tutors, etc..."
                    className="pl-10 w-full bg-background/60 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <ThemeToggle />

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-accent/80 hover:scale-105 transition-all duration-200 rounded-xl h-9 w-9 sm:h-10 sm:w-10"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs animate-pulse shadow-lg"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 sm:gap-3 h-auto py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl hover:bg-accent/80 hover:scale-105 transition-all duration-200 shadow-sm"
                    >
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-education text-white font-semibold shadow-lg text-xs sm:text-sm">
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
                    className="w-56 bg-card/95 backdrop-blur-lg border-border/50 shadow-xl rounded-xl"
                  >
                    <DropdownMenuLabel className="font-semibold text-foreground">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="hover:bg-accent/80 transition-colors duration-200 rounded-lg mx-1 font-medium"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/notifications")}
                      className="hover:bg-accent/80 transition-colors duration-200 rounded-lg mx-1 font-medium"
                    >
                      <Bell className="mr-3 h-4 w-4" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 rounded-lg mx-1 font-medium"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto bg-gradient-to-br from-background/50 to-muted/10">
            <div className="max-w-full mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
