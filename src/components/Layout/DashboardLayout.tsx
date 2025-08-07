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
import { useState, useCallback, useMemo, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}



// Memoized user data getter with caching
const getUserData = (() => {
  let cachedUser: any = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedUser && (now - cacheTime) < CACHE_DURATION) {
      return cachedUser;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      cachedUser = user;
      cacheTime = now;
      return user;
    } catch (error) {
      console.warn("Error parsing user data:", error);
      return {};
    }
  };
})();

// Performance monitoring hook
const usePerformanceMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('DashboardLayout performance monitoring enabled');
    }
  }, []);
};

// Error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('DashboardLayout error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">Please refresh the page to continue.</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Memoized header component
const Header = memo(({ 
  user, 
  notifications, 
  onNavigate, 
  onLogout 
}: { 
  user: any; 
  notifications: number; 
  onNavigate: (path: string) => void; 
  onLogout: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Implement search functionality here
  }, []);

  return (
    <header className="h-16 lg:h-18 border-b border-border/30 bg-card/90 backdrop-blur-xl sticky top-0 z-20 shadow-lg">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <SidebarTrigger className="hover:bg-accent/80 hover:scale-105 transition-all duration-200 rounded-xl p-2 sm:p-2.5 flex-shrink-0 shadow-sm touch-manipulation" />

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search students, tutors, assignments..."
              className="pl-10 sm:pl-12 w-full bg-background/70 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl text-sm h-9 sm:h-10 shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <ThemeToggle />

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent/80 hover:scale-105 transition-all duration-200 rounded-xl h-9 w-9 sm:h-10 sm:w-10 shadow-sm touch-manipulation"
            onClick={() => onNavigate("/notifications")}
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
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";

// Memoized main content component
const MainContent = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-auto bg-gradient-to-br from-background/50 via-background/30 to-muted/5">
      <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
        {children}
      </div>
    </main>
  );
});

MainContent.displayName = "MainContent";

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications] = useState(3); // Dummy notification count

  // Performance monitoring
  usePerformanceMonitor();

  // Get user info from localStorage with caching
  const user = useMemo(() => getUserData(), []);

  // Memoized navigation handler
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("user");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }, [toast, navigate]);

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              user={user} 
              notifications={notifications} 
              onNavigate={handleNavigate} 
              onLogout={handleLogout} 
            />
            <MainContent>{children}</MainContent>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default memo(DashboardLayout);
