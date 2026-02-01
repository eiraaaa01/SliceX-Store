'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { DollarSign, ListOrdered, Users } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'orders');
  }, [firestore, user]);

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'smm_services');
  }, [firestore]);

  const { data: orders, isLoading: ordersLoading } = useCollection<any>(ordersQuery);
  const { data: services, isLoading: servicesLoading } = useCollection<any>(servicesQuery);

  const stats = useMemo(() => {
    if (!orders || !services) {
      return {
        totalSpent: 0,
        totalOrders: 0,
        followersGained: 0,
      };
    }

    const completedOrders = orders.filter(order => order.status === 'Completed');

    const totalSpent = completedOrders.reduce((acc, order) => {
      const service = services.find(s => s.id === order.smmServiceId);
      if (service && service.price && order.quantity) {
        // Assuming all services are priced per 1000 units.
        return acc + ((order.quantity / 1000) * service.price);
      }
      return acc;
    }, 0);

    const totalOrders = completedOrders.length;

    const followersGained = completedOrders.reduce((acc, order) => {
      const service = services.find(s => s.id === order.smmServiceId);
      if (service && service.name && (service.name.includes('Followers') || service.name.includes('Subscribers'))) {
        return acc + (order.quantity || 0);
      }
      return acc;
    }, 0);

    return { totalSpent, totalOrders, followersGained };
  }, [orders, services]);

  const isLoading = ordersLoading || servicesLoading;

  const statCards = [
    {
      title: "Total Spent",
      amount: `$${stats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="h-6 w-6 text-muted-foreground" />,
      change: 'Based on completed orders'
    },
    {
      title: "Total Orders",
      amount: stats.totalOrders.toLocaleString(),
      icon: <ListOrdered className="h-6 w-6 text-muted-foreground" />,
      change: 'Based on completed orders'
    },
    {
      title: "Followers Gained",
      amount: `+${stats.followersGained.toLocaleString()}`,
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      change: 'Based on completed orders'
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s a summary of your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="text-2xl font-bold">{card.amount}</div>
              )}
               <p className="text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div>
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>An overview of your recent orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">No recent activity to display.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
