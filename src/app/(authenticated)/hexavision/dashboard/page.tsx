'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const firestore = useFirestore();

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading } = useCollection(usersCollectionRef);
  const totalUsers = users?.length ?? 0;

  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Spent
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0.00</div>
              <p className="text-xs text-muted-foreground">
                Total amount spent on orders
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
              {isLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <div className="text-2xl font-bold">{totalUsers}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Total registered users in the store
              </p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
