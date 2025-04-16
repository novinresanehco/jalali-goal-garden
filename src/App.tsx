
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Ideas from "./pages/Ideas";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layouts/AppLayout";
import AddItemModal from "./components/modals/AddItemModal";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Check if Firebase is properly configured
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    
    if (!apiKey || apiKey === "your_api_key_here" || apiKey.includes("YOUR_API_KEY") || 
        !projectId || projectId === "your_project_id_here" || projectId.includes("YOUR_PROJECT_ID")) {
      toast.error("تنظیمات Firebase ناقص است. لطفا فایل .env.local را تنظیم کنید.", {
        duration: 15000,
        description: "در فایل FIREBASE_SETUP.md دستورالعمل‌های راه‌اندازی Firebase را ببینید."
      });
      console.error("Firebase configuration missing or invalid. Please set up .env.local file with your Firebase credentials.");
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="goals" element={<Goals />} />
              <Route path="ideas" element={<Ideas />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AddItemModal />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
