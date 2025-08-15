import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BatchProvider } from "@/contexts/BatchContext";
import { LeaveTypesProvider } from "@/contexts/LeaveTypesContext";
import { TasksProvider } from "@/contexts/TasksContext";
import Home from "./pages/auth/Home";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard";
import HRDashboard from "./pages/dashboards/HRDashboard";
import ExecutiveDashboard from "./pages/dashboards/ExecutiveDashboard";
import TutorDashboard from "./pages/dashboards/TutorDashboard";
import Students from "./pages/people/Students";
import Tutors from "./pages/people/Tutors";
import Executives from "./pages/people/Executives";
import Managers from "./pages/people/Managers";
import HR from "./pages/people/HR";
import Assignments from "./pages/academic/Assignments";
import Journals from "./pages/academic/Journals";
import Attendance from "./pages/academic/Attendance";
import Tasks from "./pages/academic/Tasks";
import Reports from "./pages/system/Reports";
import Settings from "./pages/system/Settings";
import Profile from "./pages/system/Profile";
import Notifications from "./pages/system/Notifications";
import DashboardLayout from "./components/Layout/DashboardLayout";
import NotFound from "./pages/auth/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BatchProvider>
        <LeaveTypesProvider>
          <TasksProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
              <Route path="/dashboard/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
              <Route path="/dashboard/manager" element={<DashboardLayout><ManagerDashboard /></DashboardLayout>} />
              <Route path="/dashboard/hr" element={<DashboardLayout><HRDashboard /></DashboardLayout>} />
              <Route path="/dashboard/executive" element={<DashboardLayout><ExecutiveDashboard /></DashboardLayout>} />
              <Route path="/dashboard/tutor" element={<DashboardLayout><TutorDashboard /></DashboardLayout>} />
              <Route path="/students" element={<DashboardLayout><Students /></DashboardLayout>} />
              <Route path="/tutors" element={<DashboardLayout><Tutors /></DashboardLayout>} />
              <Route path="/executives" element={<DashboardLayout><Executives /></DashboardLayout>} />
              <Route path="/managers" element={<DashboardLayout><Managers /></DashboardLayout>} />
              <Route path="/hr" element={<DashboardLayout><HR /></DashboardLayout>} />
              <Route path="/assignments" element={<DashboardLayout><Assignments /></DashboardLayout>} />
              <Route path="/journals" element={<DashboardLayout><Journals /></DashboardLayout>} />
              <Route path="/attendance" element={<DashboardLayout><Attendance /></DashboardLayout>} />
                        <Route path="/tasks" element={<DashboardLayout><Tasks /></DashboardLayout>} />
          <Route path="/calendar" element={<DashboardLayout><Tasks /></DashboardLayout>} />
          <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
              <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
              <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
              <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </TasksProvider>
        </LeaveTypesProvider>
      </BatchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
