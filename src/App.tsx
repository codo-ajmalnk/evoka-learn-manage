import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BatchProvider } from "@/contexts/BatchContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Tutors from "./pages/Tutors";
import Executives from "./pages/Executives";
import Managers from "./pages/Managers";
import HR from "./pages/HR";
import Assignments from "./pages/Assignments";
import Journals from "./pages/Journals";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import DashboardLayout from "./components/Layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BatchProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/students" element={<DashboardLayout><Students /></DashboardLayout>} />
            <Route path="/tutors" element={<DashboardLayout><Tutors /></DashboardLayout>} />
            <Route path="/executives" element={<DashboardLayout><Executives /></DashboardLayout>} />
            <Route path="/managers" element={<DashboardLayout><Managers /></DashboardLayout>} />
            <Route path="/hr" element={<DashboardLayout><HR /></DashboardLayout>} />
            <Route path="/assignments" element={<DashboardLayout><Assignments /></DashboardLayout>} />
            <Route path="/journals" element={<DashboardLayout><Journals /></DashboardLayout>} />
            <Route path="/attendance" element={<DashboardLayout><Attendance /></DashboardLayout>} />
            <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
            <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BatchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
