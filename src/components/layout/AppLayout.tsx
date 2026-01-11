import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { BookOpen, Calculator, Landmark, ShieldCheck, Heart, Vault, Search, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Rights Wiki", icon: BookOpen, path: "/wiki" },
  { label: "Forensic Tools", icon: Calculator, path: "/tools" },
  { label: "Provider Directory", icon: Landmark, path: "/directory" },
  { label: "My Privacy Vault", icon: Vault, path: "/vault" },
];
export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex flex-row items-center gap-2 p-4">
        <div className="bg-primary text-primary-foreground p-1 rounded-md">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
          <span className="font-bold text-sm leading-none">Keystone Advocate</span>
          <span className="text-[10px] text-muted-foreground">PA Medical Rights Wiki</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path} tooltip={item.label}>
                  <Link to={item.path}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          <span className="text-[10px] text-muted-foreground">Made for Pennsylvanians</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 sm:px-6">
          <SidebarTrigger />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Link to="/emergency" className="hidden sm:block text-xs font-semibold px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full hover:bg-red-200 transition-colors">
              Emergency Rights
            </Link>
            <ThemeToggle className="static" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}