import { Routes, Route } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

import ExecutiveOverview from "./routes/index";
import Retention from "./routes/retention";
import Churn from "./routes/churn";
import Cltv from "./routes/cltv";
import Segmentation from "./routes/segmentation";
import Journey from "./routes/journey";
import AiInsights from "./routes/ai-insights";
import Customer360 from "./routes/customer-360";
import Predictive from "./routes/predictive";
import Administration from "./routes/administration";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-3 text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between gap-4 border-b border-border/40 px-4 backdrop-blur-md bg-background/60 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded-md bg-muted/40 border border-border/40">FY25 · Q1</span>
                <span>US + UK · TV Business</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 h-8 rounded-md border border-border/40 bg-muted/30 text-xs text-muted-foreground w-72">
                <Search className="h-3.5 w-3.5" />
                <span>Search customers, segments, reports…</span>
                <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-border/50 bg-background/40">⌘K</kbd>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-[11px] font-semibold text-primary-foreground">
                SC
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
            <Routes>
              <Route path="/" element={<ExecutiveOverview />} />
              <Route path="/retention" element={<Retention />} />
              <Route path="/churn" element={<Churn />} />
              <Route path="/cltv" element={<Cltv />} />
              <Route path="/segmentation" element={<Segmentation />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/ai-insights" element={<AiInsights />} />
              <Route path="/customer-360" element={<Customer360 />} />
              <Route path="/predictive" element={<Predictive />} />
              <Route path="/administration" element={<Administration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
