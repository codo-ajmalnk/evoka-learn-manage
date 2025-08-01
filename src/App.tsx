import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Tutors from "./pages/Tutors";
import Executives from "./pages/Executives";
import Managers from "./pages/Managers";
import HR from "./pages/HR";
import Assignments from "./pages/Assignments";
import DashboardLayout from "./components/Layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
