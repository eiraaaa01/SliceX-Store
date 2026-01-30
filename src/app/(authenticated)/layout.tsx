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

const NeonIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <Icon className="transition-all group-hover:drop-shadow-neon-sm" />
);

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <EmailVerificationGate>
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
                    <span><NeonIcon icon={Home} /> Home</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/services" passHref>
                  <SidebarMenuButton isActive={isActive('/services')} asChild>
                    <span><NeonIcon icon={ShoppingCart} /> Services</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/orders" passHref>
                  <SidebarMenuButton isActive={isActive('/orders')} asChild>
                    <span><NeonIcon icon={ListOrdered} /> Orders</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/account" passHref>
                  <SidebarMenuButton isActive={isActive('/account')} asChild>
                  <span><NeonIcon icon={User} /> Account</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background/50 px-4 lg:h-[60px] lg:px-6 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="lg:hidden" />
            <div className="w-full flex-1">
              {/* Can add breadcrumbs or search here */}
            </div>
            <UserNav />
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </EmailVerificationGate>
  );
}
