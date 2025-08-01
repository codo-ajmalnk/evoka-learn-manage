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
      { title: "Users", url: "/users", icon: Users },
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
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const userRole = getUserRole();
  const menuItems = getMenuItems(userRole);
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-education p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg">Evoka</h2>
                <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}