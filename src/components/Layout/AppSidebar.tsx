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
      ? "bg-red-500/20 text-red-400 border-l-4 border-red-500 font-medium"
      : "text-gray-300 hover:bg-gray-800/50 hover:text-white focus:bg-gray-800/50 focus:text-white";

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-200 ease-in-out border-r border-gray-700 bg-gray-900 min-h-screen flex-shrink-0 shadow-lg`}
      collapsible="offcanvas"
    >
      <SidebarContent className="h-full flex flex-col">
        {/* Brand Header */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/evoka-logo.png"
              alt="Evoka Logo"
              className="h-8 w-auto"
            />
          </div>
        </div>
        {/* Navigation Menu */}
        <nav
          className="flex-1 p-4 space-y-1 overflow-y-auto"
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
                        className={`${getNavCls} group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                        aria-label={
                          item.description
                            ? `${item.title} - ${item.description}`
                            : item.title
                        }
                        title={item.description}
                      >
                        <item.icon
                          className="h-5 w-5 flex-shrink-0"
                          aria-hidden="true"
                        />
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
      </SidebarContent>
    </Sidebar>
  );
}
