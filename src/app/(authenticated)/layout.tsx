'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Home, ShoppingCart, ListOrdered, User } from 'lucide-react';
import UserNav from '@/components/user-nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EmailVerificationGate from '@/components/email-verification-gate';
import ProfileCompletionGate from '@/components/profile-completion-gate';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <EmailVerificationGate>
      <ProfileCompletionGate>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/home" passHref>
                    <SidebarMenuButton isActive={isActive('/home')} asChild>
                      <span><Home /> Home</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/services" passHref>
                    <SidebarMenuButton isActive={isActive('/services')} asChild>
                      <span><ShoppingCart /> Services</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/orders" passHref>
                    <SidebarMenuButton isActive={isActive('/orders')} asChild>
                      <span><ListOrdered /> Orders</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/account" passHref>
                    <SidebarMenuButton isActive={isActive('/account')} asChild>
                    <span><User /> Account</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 lg:h-[60px] lg:px-6 backdrop-blur-sm sticky top-0 z-10">
              <SidebarTrigger className="lg:hidden" />
              <div className="w-full flex-1">
                {/* Can add breadcrumbs or search here */}
              </div>
              <UserNav />
            </header>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </ProfileCompletionGate>
    </EmailVerificationGate>
  );
}
