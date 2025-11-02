import * as React from "react";

import { navMain } from "@/config/side-menus";
import MainSideMenus from "@/components/layouts/main-side";
import { NavUser } from "@/components/nav-user";
import { SidebarGroupLabel } from "@/components/ui/sidebar";

// import { NavDocuments } from "@/components/nav-documents";
// import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";
// import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  // SidebarMenuButton,
  // SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

export function AppSidebar({
  children,
  sidetitle,
  subtitle,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  sidetitle?: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>{sidetitle}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <MainSideMenus menus={navMain} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarGroupLabel>{subtitle}</SidebarGroupLabel>
            <SidebarMenu>{children}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

{
  /* Header del dashboard con info del usuario */
}
{
  /* <div className="fixed top-0 right-0 z-50 p-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div> */
}
