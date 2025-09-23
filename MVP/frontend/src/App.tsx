import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import {
  AppProvider,
  useAppContext,
  type UserRole,
} from "./contexts/AppContext";
import RoleSelection from "./pages/RoleSelection";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { userRole, setUserRole } = useAppContext();

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
  };

  const handleBackToRoleSelection = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Index
              userRole={userRole}
              onBackToRoleSelection={handleBackToRoleSelection}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AppProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
