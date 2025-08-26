import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";

interface DashboardLayoutProps {
  /** Contenido principal del dashboard */
  children: React.ReactNode;
  /** Menú contextual que se renderiza debajo de las opciones principales */
  sidemenu: React.ReactNode;
  /** Título mostrado en el sidebar */
  sidetitle: React.ReactNode;
  /** Subtítulo o descripción del menú contextual */
  subtitle: React.ReactNode;
}

function DashboardLayout({
  children,
  sidemenu,
  sidetitle,
  subtitle,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar sidetitle={sidetitle} subtitle={subtitle}>
        {sidemenu}
      </AppSidebar>
      {children}
    </SidebarProvider>
  );
}

export default DashboardLayout;
