'use client';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { HexaVisionLogo } from "@/components/hexavision-logo";
import { LayoutDashboard, ShoppingCart, ListOrdered, Store } from "lucide-react";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import UserNav from "@/components/user-nav";

export default function HexaVisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <HexaVisionLogo />
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/hexavision/dashboard')}>
                        <Link href="/hexavision/dashboard">
                            <LayoutDashboard />
                            Dashboard
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/hexavision/services')}>
                        <Link href="/hexavision/services">
                            <ShoppingCart />
                            Services
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/hexavision/orders')}>
                        <Link href="/hexavision/orders">
                            <ListOrdered />
                            Orders
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                         <Link href="/home">
                            <Store />
                            Back to Store
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-4 md:px-6 sticky top-0 z-30">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Hexa Vision</h1>
            <UserNav />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
