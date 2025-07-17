import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
// import { UserButton } from '@clerk/nextjs';

function DashboardLayout({children, sidemenu, sidetitle, subtitle}: {children: React.ReactNode, sidemenu: React.ReactNode, sidetitle: React.ReactNode, subtitle: React.ReactNode}) {
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

            <AppSidebar  sidetitle= {sidetitle} subtitle={subtitle}>
            {sidemenu}
            </AppSidebar>
            {children}
          </SidebarProvider>
    );
}

export default DashboardLayout;