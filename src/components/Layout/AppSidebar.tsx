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
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const userRole = getUserRole();
  const menuItems = getMenuItems(userRole);
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-primary font-semibold border-r-3 border-primary shadow-lg transform scale-105" 
      : "hover:bg-gradient-to-r hover:from-accent/50 hover:to-transparent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-102";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-80"} transition-all duration-300 ease-in-out border-r border-border/50 shadow-xl bg-gradient-to-br from-sidebar-background via-sidebar-background to-sidebar-accent/20`}
      collapsible="offcanvas"
    >
      <SidebarContent className="h-full">
        {/* Brand Header */}
        <div className="p-6 border-b border-border/30 bg-gradient-to-r from-gradient-education to-gradient-primary">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg ring-1 ring-white/30">
              <GraduationCap className="h-7 w-7 text-white drop-shadow-sm" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h2 className="font-bold text-xl text-white drop-shadow-sm tracking-wide">Evoka</h2>
                <p className="text-xs text-white/80 capitalize font-medium tracking-wider">{userRole} Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 space-y-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-3 px-2">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={`${getNavCls} group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden`}
                      >
                        <div className="relative z-10 flex items-center gap-3 w-full">
                          <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                          {!collapsed && (
                            <span className="font-medium tracking-wide truncate">
                              {item.title}
                            </span>
                          )}
                        </div>
                        {/* Hover effect background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/30 bg-gradient-to-r from-muted/30 to-transparent">
          {!collapsed && (
            <div className="text-center animate-fade-in">
              <p className="text-xs text-muted-foreground font-medium">
                © 2024 Evoka Education
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Management System
              </p>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}