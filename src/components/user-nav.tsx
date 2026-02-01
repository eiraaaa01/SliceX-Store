'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
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
import { User as UserIcon, LogOut, Settings, Building, ListOrdered, Wallet, MessageSquare, CreditCard } from "lucide-react";
import Link from 'next/link';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { doc } from 'firebase/firestore';
import { useLoading } from "@/context/LoadingContext";

export default function UserNav() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { showLoading } = useLoading();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{isEmployee?: boolean, coins?: number, walletBalance?: number}>(userDocRef);

  const handleSignOut = async () => {
    if (auth) {
      showLoading();
      await signOut(auth);
      // This is a special case. We want to clear the loading indicator immediately
      // on the login page, so we don't call hideLoading() here.
      router.push('/');
    }
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9 border-2 border-primary/50 hover:border-primary transition-colors">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || "User avatar"} />
            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || 'Username'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/account" passHref>
            <DropdownMenuItem onClick={() => { if (pathname !== '/account') showLoading() }}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/orders" passHref>
             <DropdownMenuItem onClick={() => { if (pathname !== '/orders') showLoading() }}>
                <ListOrdered className="mr-2 h-4 w-4" />
                <span>Orders</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Coins</span>
            <DropdownMenuShortcut>{userProfile?.coins ?? 0}</DropdownMenuShortcut>
          </DropdownMenuItem>
           <Link href="/wallet" passHref>
                <DropdownMenuItem onClick={() => { if (pathname !== '/wallet') showLoading() }}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                </DropdownMenuItem>
            </Link>
           <DropdownMenuItem>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Chat Support</span>
            <DropdownMenuShortcut>Soon</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        {userProfile?.isEmployee && (
            <>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Building className="mr-2 h-4 w-4" />
                    <span>Hexa Vision</span>
                  </DropdownMenuItem>
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
                    <AlertDialogAction onClick={() => { 
                      if (!pathname.startsWith('/hexavision')) {
                        showLoading(); 
                      }
                      router.push('/hexavision/dashboard'); 
                    }}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
             <Link href="/account" passHref>
                <DropdownMenuItem onClick={() => { if (pathname !== '/account') showLoading() }}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
