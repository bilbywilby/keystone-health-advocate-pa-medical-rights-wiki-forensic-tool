import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { BookOpen, Calculator, Landmark, ShieldCheck, Heart, Vault, Home, FileText, Globe, Gavel, Zap, Phone, AlertCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccessibilityToggle } from "@/components/AccessibilityToggle";
import { AccessibilityProvider } from "@/hooks/use-accessibility";
import { api } from "@/lib/api-client";
import { CommunityStats } from "@shared/types";
import { cn } from "@/lib/utils";
const NAV_ITEMS = [
  { label: "Home Dashboard", icon: Home, path: "/" },
  { label: "Rights Wiki", icon: BookOpen, path: "/wiki" },
  { label: "Dispute Suite", icon: Gavel, path: "/disputes" },
  { label: "Forensic Tools", icon: Calculator, path: "/tools" },
  { label: "Appeal Generator", icon: FileText, path: "/appeal-generator" },
  { label: "Provider Directory", icon: Landmark, path: "/directory" },
  { label: "My Privacy Vault", icon: Vault, path: "/vault" },
];
function AppSidebarInternal() {
  const location = useLocation();
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex flex-row items-center gap-2 p-4">
        <div className="bg-amber-500 text-slate-950 p-1.5 rounded-lg shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
          <span className="font-extrabold text-sm leading-none tracking-tight">Keystone Advocate</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">2026 PA Defense</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase text-slate-400">Defense Suite</SidebarGroupLabel>
          <SidebarMenu className="px-2">
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path} tooltip={item.label}>
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className={cn("w-4 h-4", location.pathname === item.path && "text-amber-500")} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Built for PA Residents</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
function MainContent({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  useEffect(() => {
    api<CommunityStats>('/api/benchmarks/stats').then(setStats).catch(() => {});
  }, []);
  return (
    <SidebarProvider>
      <AppSidebarInternal />
      <SidebarInset className="relative flex flex-col bg-white dark:bg-slate-950">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6">
          <SidebarTrigger className="hover:bg-slate-100 transition-colors" />
          <div className="flex-1" />
          <div className="flex items-center gap-2 sm:gap-6">
            {stats && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">SB 371 Active</span>
              </div>
            )}
            <Link to="/emergency" className="hidden sm:block text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-sm">
              Emergency Rights
            </Link>
            <div className="flex items-center gap-1 border-l pl-2 sm:pl-4">
              <AccessibilityToggle />
              <ThemeToggle className="static" />
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 md:py-16 pb-24 md:pb-16">
            {children}
          </div>
        </main>
        {/* Mobile Crisis Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-red-600 text-white border-t border-red-500 p-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2">
             <AlertCircle className="w-5 h-5" />
             <span className="text-xs font-black uppercase tracking-tighter">Emergency Rights Mode</span>
          </div>
          <div className="flex gap-2">
             <Button asChild size="sm" variant="outline" className="bg-white text-red-600 border-none h-8 text-[10px] font-bold">
                <a href="tel:18778816388"><Phone className="w-3 h-3 mr-1" /> Call PID</a>
             </Button>
             <Button asChild size="sm" className="bg-slate-950 text-white h-8 text-[10px] font-bold">
                <Link to="/emergency">Read Rights</Link>
             </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      <MainContent>{children}</MainContent>
    </AccessibilityProvider>
  );
}