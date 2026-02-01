import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
    { id: "ORD001", service: "Instagram Followers", date: "2023-10-26", amount: "₹25.00", status: "Completed" },
    { id: "ORD002", service: "YouTube Views", date: "2023-10-25", amount: "₹10.00", status: "In Progress" },
    { id: "ORD003", service: "TikTok Likes", date: "2023-10-24", amount: "₹5.00", status: "Completed" },
    { id: "ORD004", service: "Twitter Retweets", date: "2023-10-23", amount: "₹15.00", status: "Canceled" },
]

export default function OrdersPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Your Orders</h1>
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.service}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.amount}</TableCell>
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
    </div>
  );
}
