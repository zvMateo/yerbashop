"use client";

import React from "react";
import { navMain } from "@/config/side-menus";
import MainSideMenus from "@/components/layouts/main-side";
import { UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  /** Título mostrado en la cabecera del sidebar */
  sidetitle?: React.ReactNode;
  /** Texto descriptivo para el menú secundario */
  subtitle?: React.ReactNode;
}

/**
 * Barra lateral principal de la aplicación. Centraliza la autenticación y los menús
 * y se adapta a dispositivos móviles usando `useIsMobile`.
 */
export function AppSidebar({
  children,
  sidetitle,
  subtitle,
  ...props
}: AppSidebarProps) {
  const isMobile = useIsMobile();
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "offcanvas"} {...props}>
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
            {subtitle && <SidebarGroupLabel>{subtitle}</SidebarGroupLabel>}
            <SidebarMenu>{children}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {clerkKey && (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 rounded-lg",
                rootBox: "mx-auto",
                card: "shadow-lg",
                button: "w-full justify-start",
              },
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
