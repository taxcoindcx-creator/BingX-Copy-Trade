import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import History from "@/pages/History";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

// Components
import { BottomNav } from "@/components/BottomNav";

// Layout wrapper for authenticated pages
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground pb-safe">
      <main className="max-w-md mx-auto min-h-screen relative p-4 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  // Simple location-based animation key
  // This allows pages to cross-fade nicely
  
  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/">
          <Login />
        </Route>
        
        {/* Authenticated Routes */}
        <Route path="/home">
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        </Route>

        <Route path="/history">
          <DashboardLayout>
            <History />
          </DashboardLayout>
        </Route>

        <Route path="/profile">
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </Route>

        <Route path="/settings">
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
