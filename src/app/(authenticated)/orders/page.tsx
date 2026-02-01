'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

// Mock data, as we don't have a backend for this yet.
const orders: any[] = []

export default function OrdersPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Your Orders</h1>
        {orders.length > 0 ? (
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>₹{order.amount}</TableCell>
                <TableCell>
                  <Badge variant={
                      order.status === "Completed" ? "default" :
                      order.status === "In Progress" ? "secondary" : "destructive"
                  }>
                      {order.status}
                  </Badge>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-card/50">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold">No Orders Yet</h2>
                <p className="text-muted-foreground mt-2">You haven't placed any orders with us. <br/> When you do, they'll show up here.</p>
            </div>
        )}
    </div>
  );
}
