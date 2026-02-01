'use client';
import { Logo } from '@/components/logo';
import UserNav from '@/components/user-nav';
import EmailVerificationGate from '@/components/email-verification-gate';
import ProfileCompletionGate from '@/components/profile-completion-gate';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import Cart from '@/components/Cart';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cartCount } = useCart();

  return (
    <EmailVerificationGate>
      <ProfileCompletionGate>
        <Sheet>
            <div className="min-h-screen flex flex-col bg-background">
                 <header className="flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-4 md:px-6 backdrop-blur-sm sticky top-0 z-30">
                    <Logo />
                    <div className="flex items-center gap-4">
                        <SheetTrigger asChild>
                            <Button className="rounded-full font-semibold px-6">
                                Cart ({cartCount})
                            </Button>
                        </SheetTrigger>
                        <UserNav />
                    </div>
                </header>
                <main className="flex-1">{children}</main>
                <Cart />
            </div>
        </Sheet>
      </ProfileCompletionGate>
    </EmailVerificationGate>
  );
}
