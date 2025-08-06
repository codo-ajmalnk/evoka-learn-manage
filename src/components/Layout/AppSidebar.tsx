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
      ? "bg-accent/80 text-foreground border border-border/50 font-medium shadow-sm"
      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground focus:bg-accent/50 focus:text-foreground";

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 ease-in-out border-r border-border/50 bg-card/80 backdrop-blur-xl min-h-screen flex-shrink-0 shadow-xl`}
      collapsible="offcanvas"
    >
      <SidebarContent className="h-full flex flex-col">
        {/* Brand Header */}
        <div className="p-6 border-b border-border/30 flex-shrink-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-center w-full">
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
              <img
                src="/evoka-logo.png"
                alt="Evoka Logo"
                className="h-6 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav
          className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide"
          role="navigation"
          aria-label="Main navigation"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* Internet Explorer 10+ */,
          }}
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
                        className={`${getNavCls} group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 hover:shadow-sm`}
                        aria-label={
                          item.description
                            ? `${item.title} - ${item.description}`
                            : item.title
                        }
                        title={item.description}
                      >
                        <div className="p-1.5 rounded-lg bg-background/50 group-hover:bg-primary/10 transition-colors duration-200">
                          <item.icon
                            className="h-4 w-4 flex-shrink-0"
                            aria-hidden="true"
                          />
                        </div>
                        {!collapsed && (
                          <span className="font-medium truncate">
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>

        {/* User Info Section */}
        {!collapsed && (
          <div className="p-4 border-t border-border/30 bg-gradient-to-r from-muted/20 to-background/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
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
        )}
      </SidebarContent>
    </Sidebar>
  );
}
