import { useState } from "react";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  FileText, 
  BarChart3, 
  Settings, 
  GraduationCap,
  UserCheck,
  Briefcase,
  User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// Get user role from localStorage (dummy data)
const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role || "student";
};

const getMenuItems = (role: string) => {
  const commonItems = [
    { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  ];

  const roleSpecificItems: Record<string, any[]> = {
    admin: [
      { title: "Students", url: "/students", icon: GraduationCap },
      { title: "Tutors", url: "/tutors", icon: User },
      { title: "Executives", url: "/executives", icon: Briefcase },
      { title: "Managers", url: "/managers", icon: UserCheck },
      { title: "HR", url: "/hr", icon: User },
      { title: "Journals", url: "/journals", icon: DollarSign },
      { title: "Assignments", url: "/assignments", icon: BookOpen },
      { title: "Attendance", url: "/attendance", icon: Calendar },
      { title: "Reports", url: "/reports", icon: FileText },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
    manager: [
      { title: "Students", url: "/students", icon: GraduationCap },
      { title: "Executives", url: "/executives", icon: Briefcase },
      { title: "Tutors", url: "/tutors", icon: User },
      { title: "Journals", url: "/journals", icon: DollarSign },
      { title: "Assignments", url: "/assignments", icon: BookOpen },
      { title: "Attendance", url: "/attendance", icon: Calendar },
      { title: "Reports", url: "/reports", icon: FileText },
    ],
    hr: [
      { title: "Students", url: "/students", icon: GraduationCap },
      { title: "Executives", url: "/executives", icon: Briefcase },
      { title: "Tutors", url: "/tutors", icon: User },
      { title: "HR", url: "/hr", icon: User },
      { title: "Journals", url: "/journals", icon: DollarSign },
      { title: "Assignments", url: "/assignments", icon: BookOpen },
      { title: "Attendance", url: "/attendance", icon: Calendar },
      { title: "Reports", url: "/reports", icon: FileText },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
    executive: [
      { title: "Students", url: "/students", icon: GraduationCap },
      { title: "Journals", url: "/journals", icon: DollarSign },
      { title: "Reports", url: "/reports", icon: FileText },
    ],
    tutor: [
      { title: "Students", url: "/students", icon: GraduationCap },
      { title: "Assignments", url: "/assignments", icon: BookOpen },
      { title: "Reports", url: "/reports", icon: FileText },
    ],
    student: [
      { title: "My Profile", url: "/profile", icon: User },
      { title: "Assignments", url: "/assignments", icon: BookOpen },
      { title: "Attendance", url: "/attendance", icon: Calendar },
      { title: "Payments", url: "/payments", icon: DollarSign },
    ],
  };

  return [...commonItems, ...(roleSpecificItems[role] || [])];
};

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const userRole = getUserRole();
  const menuItems = getMenuItems(userRole);
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold border-r-3 border-primary shadow-sm" 
      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200";

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-72"
      } bg-background/95 backdrop-blur-sm border-r border-border/50 shadow-lg transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="h-full">
        {/* Header */}
        <div className={`${collapsed ? "p-3" : "p-6"} border-b border-border/30 bg-gradient-to-r from-primary/5 to-primary/10`}>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-xl shadow-md">
              <GraduationCap className={`${collapsed ? "h-5 w-5" : "h-6 w-6"} text-white`} />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <h2 className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Evoka
                </h2>
                <p className="text-xs text-muted-foreground/80 capitalize font-medium tracking-wide">
                  {userRole} Portal
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 py-4">
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                Main Menu
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent className="px-3">
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`${
                        collapsed ? "justify-center p-3" : "justify-start px-4 py-3"
                      } rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      <NavLink 
                        to={item.url} 
                        end 
                        className={({ isActive }) => `
                          flex items-center gap-3 w-full min-h-[44px] rounded-xl
                          ${getNavCls({ isActive })}
                          ${collapsed ? "justify-center" : "justify-start"}
                        `}
                      >
                        <item.icon className={`${collapsed ? "h-5 w-5" : "h-5 w-5"} flex-shrink-0`} />
                        {!collapsed && (
                          <span className="font-medium text-sm tracking-wide truncate">
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
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border/30 bg-gradient-to-r from-muted/10 to-muted/5">
            <div className="text-xs text-muted-foreground/60 text-center">
              © 2024 Evoka Education
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}