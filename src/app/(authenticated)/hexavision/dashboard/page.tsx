'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collection, doc } from 'firebase/firestore';
import { useLoading } from "@/context/LoadingContext";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const firestore = useFirestore();
  const { showLoading, hideLoading } = useLoading();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{isAdmin?: boolean}>(userDocRef);

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading: areUsersLoading } = useCollection(usersCollectionRef);

  const isLoading = isAuthLoading || isProfileLoading || areUsersLoading;

  useEffect(() => {
    if (isLoading) {
      showLoading();
      return () => hideLoading();
    } else {
      if (userProfile && !userProfile.isAdmin) {
          router.replace('/home');
      }
    }
  }, [isLoading, userProfile, router, showLoading, hideLoading]);

  const totalUsers = users?.length ?? 0;

  if (isLoading || !userProfile?.isAdmin) {
    return null;
  }

  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earning
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0.00</div>
              <p className="text-xs text-muted-foreground">
                Total earnings from orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Total number of orders placed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Total registered users in the store
              </p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
