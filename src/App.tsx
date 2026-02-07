import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestEnvironment from "./pages/TestEnvironment";
import EventLogViewer from "./pages/EventLogViewer";
import NotFound from "./pages/NotFound";
import { APP_CONFIG } from "./config/appConfig";
import { isChromeBrowser } from "./utils/browser"; 

const queryClient = new QueryClient();

const App = () => {
  const isAllowed = isChromeBrowser();

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg font-semibold text-destructive">
          {APP_CONFIG.BROWSER_RESTRICT_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TestEnvironment />} />
            <Route path="/event-log" element={<EventLogViewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
