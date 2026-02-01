'use client';
import { Logo } from '@/components/logo';
import UserNav from '@/components/user-nav';
import EmailVerificationGate from '@/components/email-verification-gate';
import ProfileCompletionGate from '@/components/profile-completion-gate';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import Cart from '@/components/Cart';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { Building } from 'lucide-react';
import DraggableHomeButton from '@/components/DraggableHomeButton';


export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cartCount } = useCart();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{isEmployee?: boolean}>(userDocRef);

  return (
    <EmailVerificationGate>
      <ProfileCompletionGate>
        <Sheet>
            <div className="min-h-screen flex flex-col bg-background">
                 <header className="flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-4 md:px-6 backdrop-blur-sm sticky top-0 z-30">
                    <Logo />
                    <div className="flex items-center gap-4">
                        {userProfile?.isEmployee && (
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" className="hidden sm:flex">
                                  <Building className="mr-2 h-4 w-4" />
                                  Hexa Vision
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Switch to Hexa Vision Panel?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    You are about to be redirected to the Hexa Vision SMM panel. Do you want to continue?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => router.push('/hexavision/dashboard')}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        )}
                        <SheetTrigger asChild>
                            <Button className="rounded-full font-semibold px-6">
                                Cart ({cartCount})
                            </Button>
                        </SheetTrigger>
                        <UserNav />
                    </div>
                </header>
                <main className="flex-1">{children}</main>
                <DraggableHomeButton />
                <Cart />
            </div>
        </Sheet>
      </ProfileCompletionGate>
    </EmailVerificationGate>
  );
}
