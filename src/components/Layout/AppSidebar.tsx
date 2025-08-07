import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  GraduationCap,
  LucideIcon,
  Menu,
  Settings,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo, useCallback, memo } from "react";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

// Memoized user role getter with caching
const getUserRole = (() => {
  let cachedRole: string | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedRole && (now - cacheTime) < CACHE_DURATION) {
      return cachedRole;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      cachedRole = user.role || "Admin";
      cacheTime = now;
      return cachedRole;
    } catch (error) {
      console.warn("Error parsing user data:", error);
      return "Admin";
    }
  };
})();

// Memoized menu items with role-based caching
const getMenuItems = (() => {
  const menuCache = new Map<string, MenuItem[]>();
  
  return (role: string): MenuItem[] => {
    if (menuCache.has(role)) {
      return menuCache.get(role)!;
    }

    const commonItems: MenuItem[] = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: BarChart3,
        description: "Overview and analytics",
      },
      {
        title: "Students",
        url: "/students",
        icon: GraduationCap,
        description: "Manage student information",
      },
      {
        title: "Tutors",
        url: "/tutors",
        icon: Users,
        description: "Manage tutor information",
      },
      {
        title: "Executives",
        url: "/executives",
        icon: Briefcase,
        description: "Executive management",
      },
      {
        title: "Managers",
        url: "/managers",
        icon: UserCheck,
        description: "Manager administration",
      },
      { title: "HR", url: "/hr", icon: User, description: "Human resources" },
      {
        title: "Journals",
        url: "/journals",
        icon: DollarSign,
        description: "Financial journals",
      },
      {
        title: "Assignments",
        url: "/assignments",
        icon: BookOpen,
        description: "Course assignments",
      },
      {
        title: "Attendance",
        url: "/attendance",
        icon: Calendar,
        description: "Track attendance",
      },
      {
        title: "Reports",
        url: "/reports",
        icon: FileText,
        description: "Generate reports",
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        description: "System settings",
      },
    ];

    const roleSpecificItems: Record<string, MenuItem[]> = {
      admin: commonItems,
      manager: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: BarChart3,
          description: "Overview and analytics",
        },
        {
          title: "Students",
          url: "/students",
          icon: GraduationCap,
          description: "Manage student information",
        },
        {
          title: "Tutors",
          url: "/tutors",
          icon: Users,
          description: "Manage tutor information",
        },
        {
          title: "Executives",
          url: "/executives",
          icon: Briefcase,
          description: "Executive management",
        },
        { title: "HR", url: "/hr", icon: User, description: "Human resources" },
        {
          title: "Journals",
          url: "/journals",
          icon: DollarSign,
          description: "Financial journals",
        },
        {
          title: "Assignments",
          url: "/assignments",
          icon: BookOpen,
          description: "Course assignments",
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: Calendar,
          description: "Track attendance",
        },
        {
          title: "Reports",
          url: "/reports",
          icon: FileText,
          description: "Generate reports",
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          description: "System settings",
        },
      ],
      hr: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: BarChart3,
          description: "Overview and analytics",
        },
        {
          title: "Students",
          url: "/students",
          icon: GraduationCap,
          description: "Manage student information",
        },
        {
          title: "Tutors",
          url: "/tutors",
          icon: Users,
          description: "Manage tutor information",
        },
        {
          title: "Journals",
          url: "/journals",
          icon: DollarSign,
          description: "Financial journals",
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: Calendar,
          description: "Track attendance",
        },
        {
          title: "Reports",
          url: "/reports",
          icon: FileText,
          description: "Generate reports",
        },
      ],
      executive: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: BarChart3,
          description: "Overview and analytics",
        },
        {
          title: "Students",
          url: "/students",
          icon: GraduationCap,
          description: "Manage student information",
        },
        {
          title: "Tutors",
          url: "/tutors",
          icon: Users,
          description: "Manage tutor information",
        },
        {
          title: "Journals",
          url: "/journals",
          icon: DollarSign,
          description: "Financial journals",
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: Calendar,
          description: "Track attendance",
        },
        {
          title: "Reports",
          url: "/reports",
          icon: FileText,
          description: "Generate reports",
        },
      ],
      tutor: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: BarChart3,
          description: "Overview and analytics",
        },
        {
          title: "Students",
          url: "/students",
          icon: GraduationCap,
          description: "View student information",
        },
        {
          title: "Assignments",
          url: "/assignments",
          icon: BookOpen,
          description: "Manage assignments",
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: Calendar,
          description: "Track attendance",
        },
      ],
      student: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: BarChart3,
          description: "Your overview",
        },
        {
          title: "Assignments",
          url: "/assignments",
          icon: BookOpen,
          description: "View your assignments",
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: Calendar,
          description: "View your attendance",
        },
      ],
    };

    const items = roleSpecificItems[role] || commonItems;
    menuCache.set(role, items);
    return items;
  };
})();

// Memoized navigation item component
const NavigationItem = memo(({ 
  item, 
  isActive, 
  collapsed, 
  onNavClick 
}: { 
  item: MenuItem; 
  isActive: boolean; 
  collapsed: boolean; 
  onNavClick: () => void;
}) => {
  const getNavCls = useCallback(({ isActive }: { isActive: boolean }) => {
    const baseClasses = "group flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 hover:shadow-lg active:scale-95 touch-manipulation";
    
    if (isActive) {
      return `${baseClasses} bg-primary/10 text-primary border-2 border-primary/20 font-semibold shadow-md hover:bg-primary/15 hover:shadow-lg`;
    }
    
    return `${baseClasses} text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:border hover:border-accent/30`;
  }, []);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          end
          className={`${getNavCls({ isActive })} sidebar-nav-item touch-friendly focus-visible-enhanced interactive-element`}
          onClick={onNavClick}
          aria-label={
            item.description
              ? `${item.title} - ${item.description}`
              : item.title
          }
          title={item.description}
        >
          <div className="p-2 rounded-lg bg-background/50 group-hover:bg-primary/10 group-active:bg-primary/20 transition-all duration-200 flex-shrink-0">
            <item.icon
              className="h-4 w-4"
              aria-hidden="true"
            />
          </div>
          {!collapsed && (
            <span className="font-medium truncate flex-1 text-left">
              {item.title}
            </span>
          )}
          
          {/* Active indicator for collapsed state */}
          {collapsed && isActive && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

NavigationItem.displayName = "NavigationItem";

// Memoized user info component
const UserInfo = memo(({ userRole, collapsed }: { userRole: string; collapsed: boolean }) => {
  if (!collapsed) {
    return (
      <div className="p-3 sm:p-4 border-t border-border/30 bg-gradient-to-r from-muted/20 to-background/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30 shadow-sm hover:bg-background/70 transition-colors duration-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <span className="text-xs font-bold text-white">
              {userRole.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {userRole}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userRole} Access
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-border/30">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md mx-auto">
        <span className="text-xs font-bold text-white">
          {userRole.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  );
});

UserInfo.displayName = "UserInfo";

// Performance monitoring hook
const usePerformanceMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AppSidebar performance monitoring enabled');
    }
  }, []);
};

// Error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Sidebar error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Something went wrong. Please refresh the page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const userRole = getUserRole();
  const menuItems = useMemo(() => getMenuItems(userRole), [userRole]);
  const collapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);

  // Performance monitoring
  usePerformanceMonitor();

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  // Handle scroll effect for mobile with throttling
  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [isMobile, handleScroll]);

  // Memoized navigation click handler
  const handleNavClick = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  // Memoized close handler
  const handleClose = useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  return (
    <ErrorBoundary>
      <Sidebar
        className={`${
          collapsed ? "w-16" : "w-64"
        } sidebar-enhanced transition-all duration-300 ease-in-out border-r border-border/50 bg-card/95 backdrop-blur-xl min-h-screen flex-shrink-0 shadow-2xl`}
        collapsible="offcanvas"
      >
        <SidebarContent className="h-full flex flex-col">
          {/* Brand Header */}
          <div className="p-4 sm:p-6 border-b border-border/30 flex-shrink-0 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 shadow-sm hover:bg-primary/20 transition-colors duration-200">
                  <img
                    src="/evoka-logo.png"
                    alt="Evoka Logo"
                    className="h-6 w-auto"
                    loading="lazy"
                  />
                </div>             
              </div>
              
              {/* Mobile Close Button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8 rounded-lg hover:bg-accent/80 hover:scale-105 transition-all duration-200 touch-friendly focus-visible-enhanced interactive-element"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav
            className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto scrollbar-hide"
            role="navigation"
            aria-label="Main navigation"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* Internet Explorer 10+ */,
            }}
          >
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {menuItems.map((item) => (
                    <NavigationItem
                      key={item.title}
                      item={item}
                      isActive={currentPath === item.url}
                      collapsed={collapsed}
                      onNavClick={handleNavClick}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </nav>

          {/* User Info Section */}
          <UserInfo userRole={userRole} collapsed={collapsed} />
        </SidebarContent>
      </Sidebar>
    </ErrorBoundary>
  );
}
