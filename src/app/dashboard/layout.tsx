import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function DashboardLayout({
  children,
  sidemenu,
  sidetitle,
  subtitle,
}: {
  children: React.ReactNode;
  sidemenu: React.ReactNode;
  sidetitle: React.ReactNode;
  subtitle: React.ReactNode;
}) {
  // Verificar autenticación
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* Header del dashboard con info del usuario */}
      {/* <div className="fixed top-0 right-0 z-50 p-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div> */}

      <AppSidebar sidetitle={sidetitle} subtitle={subtitle}>
        {sidemenu}
      </AppSidebar>
      {children}
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}

export default DashboardLayout;
