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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 lg:h-18 border-b border-border/20 bg-background/80 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <SidebarTrigger className="hover:bg-accent/80 hover:scale-105 transition-all duration-200 rounded-xl p-2.5 flex-shrink-0" />

                {/* Search Bar */}
                <div className="relative flex-1 max-w-lg hidden sm:block">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Quick search (Ctrl + K)"
                    className="pl-12 h-11 w-full bg-muted/50 backdrop-blur-sm border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl text-sm shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <ThemeToggle />

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-accent/80 hover:scale-105 transition-all duration-200 rounded-xl h-10 w-10 shadow-sm"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse shadow-lg border-2 border-background"
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
                      className="flex items-center gap-3 h-auto py-2 px-3 rounded-xl hover:bg-accent/80 hover:scale-105 transition-all duration-200 shadow-sm border border-border/50"
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20 ring-offset-2 ring-offset-background shadow-md">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg text-sm">
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
                    className="w-64 bg-card/95 backdrop-blur-lg border-border/50 shadow-xl rounded-xl p-2"
                  >
                    <DropdownMenuLabel className="font-semibold text-foreground px-3 py-2">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50 my-2" />
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="hover:bg-accent/80 transition-colors duration-200 rounded-lg mx-1 font-medium px-3 py-2.5"
                    >
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/notifications")}
                      className="hover:bg-accent/80 transition-colors duration-200 rounded-lg mx-1 font-medium px-3 py-2.5"
                    >
                      <Bell className="mr-3 h-4 w-4" />
                      <span>Notifications</span>
                      {notifications > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {notifications}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 my-2" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 rounded-lg mx-1 font-medium px-3 py-2.5"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gradient-to-br from-background/80 to-muted/10">
            <div className="max-w-full mx-auto animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
