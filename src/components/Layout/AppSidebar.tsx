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
  Settings,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role || "Admin";
};

const getMenuItems = (role: string): MenuItem[] => {
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

  return roleSpecificItems[role] || commonItems;
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const userRole = getUserRole();
  const menuItems = getMenuItems(userRole);
  const collapsed = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/15 text-primary border-r-2 border-primary font-semibold shadow-sm"
      : "text-muted-foreground hover:bg-accent/80 hover:text-foreground transition-all duration-200";

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-72"
      } transition-all duration-300 ease-in-out border-r border-border/50 bg-card/80 backdrop-blur-xl min-h-screen flex-shrink-0 shadow-lg`}
      collapsible="offcanvas"
    >
      <SidebarContent className="h-full flex flex-col bg-gradient-to-b from-card/90 to-card/70">
        {/* Brand Header */}
        <div className="p-6 border-b border-border/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <img
                src="/evoka-logo.png"
                alt="Evoka Logo"
                className="h-6 w-6 filter brightness-0 invert"
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-foreground tracking-tight">Evoka</h1>
                <p className="text-xs text-muted-foreground font-medium">Education Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info Card */}
        {!collapsed && (
          <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-md">
                {JSON.parse(localStorage.getItem("user") || "{}").name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {JSON.parse(localStorage.getItem("user") || "{}").name || "User"}
                </p>
                <p className="text-xs text-muted-foreground capitalize font-medium truncate">
                  {JSON.parse(localStorage.getItem("user") || "{}").role || "user"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav
          className="flex-1 p-4 space-y-2 overflow-y-auto"
          role="navigation"
          aria-label="Main navigation"
        >
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`${getNavCls} group flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background hover:scale-[1.02] hover:shadow-sm`}
                        aria-label={
                          item.description
                            ? `${item.title} - ${item.description}`
                            : item.title
                        }
                        title={item.description}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/50 group-hover:bg-primary/10 transition-colors duration-200">
                          <item.icon
                            className="h-4 w-4 flex-shrink-0"
                            aria-hidden="true"
                          />
                        </div>
                        {!collapsed && (
                          <div className="flex-1 min-w-0">
                            <span className="font-medium truncate block">
                              {item.title}
                            </span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground truncate block mt-0.5">
                                {item.description}
                              </span>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border/30">
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">
                © 2024 Evoka Platform
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                v1.0.0
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
