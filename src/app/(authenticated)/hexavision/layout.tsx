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
import { LayoutDashboard, ShoppingCart, ListOrdered, Store, Package } from "lucide-react";
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import UserNav from "@/components/user-nav";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from 'firebase/firestore';
import { useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";

export default function HexaVisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const { showLoading, hideLoading } = useLoading();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{isEmployee?: boolean}>(userDocRef);
  const isLoading = isAuthLoading || isProfileLoading;

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  useEffect(() => {
    if (isLoading) {
      return; // Wait for loading to complete
    }

    // Once loading is done, check for authorization
    if (!user || !userProfile?.isEmployee) {
      router.replace('/home');
    }
  }, [isLoading, user, userProfile, router]);


  const isActive = (path: string) => pathname.startsWith(path);

  // Render null if still loading or if the user is not (yet) authorized.
  // The useEffect above handles the redirection and loading indicator.
  if (isLoading || !userProfile?.isEmployee) {
    return null;
  }

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
                    <SidebarMenuButton asChild isActive={isActive('/hexavision/products')}>
                        <Link href="/hexavision/products">
                            <Package />
                            Products
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
