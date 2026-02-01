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
import { LayoutDashboard, Store, Package } from "lucide-react";
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

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{isAdmin?: boolean, isEmployee?: boolean}>(userDocRef);
  const isLoading = isAuthLoading || isProfileLoading;
  const isAdmin = userProfile?.isAdmin ?? false;
  const isEmployee = userProfile?.isEmployee ?? false;
  
  const getPanelName = () => {
    const adminPaths = ['/hexavision/dashboard', '/hexavision/products'];
    const employeePaths = ['/hexavision/services', '/hexavision/orders'];

    if (employeePaths.some(path => pathname.startsWith(path))) {
        return "Hexa Vision";
    }
    if (adminPaths.some(path => pathname.startsWith(path))) {
        return "Admin Panel";
    }
    
    // Fallback for the root /hexavision page before redirect
    if (isAdmin) return "Admin Panel";
    if (isEmployee) return "Hexa Vision";

    return "";
  }
  const panelName = getPanelName();

  useEffect(() => {
    if (isLoading) {
      showLoading();
      return () => hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  useEffect(() => {
    if (isLoading) {
      return; // Wait for loading to complete
    }

    if (panelName) {
      document.title = panelName;
    }

    // Once loading is done, check for authorization
    if (!user || (!isAdmin && !isEmployee)) {
      router.replace('/home');
    }
  }, [isLoading, user, isAdmin, isEmployee, router, panelName]);


  const isActive = (path: string) => pathname.startsWith(path);
  
  // Render null if still loading or if the user is not (yet) authorized.
  // The useEffect above handles the redirection and loading indicator.
  if (isLoading || (!isAdmin && !isEmployee)) {
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
                {isAdmin && (
                  <>
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
                  </>
                )}
                 {isEmployee && (
                    <>
                        {/* The Hexa Vision employee panel is under construction.
                            No navigation items are needed here for now.
                            This block is preserved to maintain the role-based logic
                            for accessing the panel itself. */}
                    </>
                 )}
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
            <h1 className="text-lg font-semibold">{panelName}</h1>
            <UserNav />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
