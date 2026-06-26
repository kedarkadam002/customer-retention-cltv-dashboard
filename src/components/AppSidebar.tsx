import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Repeat,
  AlertTriangle,
  Gem,
  Users,
  GitBranch,
  Sparkles,
  UserSearch,
  Brain,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LGMark } from "./LGMark";

const NAV = [
  { title: "Executive Overview", url: "/", icon: LayoutDashboard },
  { title: "Retention Analytics", url: "/retention", icon: Repeat },
  { title: "Churn Intelligence", url: "/churn", icon: AlertTriangle },
  { title: "Customer Lifetime Value", url: "/cltv", icon: Gem },
  { title: "Customer Segmentation", url: "/segmentation", icon: Users },
  { title: "Customer Journey", url: "/journey", icon: GitBranch },
  { title: "AI Insights Center", url: "/ai-insights", icon: Sparkles },
  { title: "Customer 360", url: "/customer-360", icon: UserSearch },
  { title: "Predictive Analytics", url: "/predictive", icon: Brain },
  { title: "Administration", url: "/administration", icon: Settings },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-4 border-b border-sidebar-border">
        <LGMark size={34} />
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:border-l-2 data-[active=true]:border-primary rounded-md"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="text-[13px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="text-[10px] text-muted-foreground/70 leading-snug">
          v4.2 · Enterprise Edition
          <br />
          US + UK · TV Business Unit
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
