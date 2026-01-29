import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const orders = [
  {
    id: "ORD001",
    service: "Instagram Followers",
    amount: "1,000",
    price: "$10.00",
    date: "2023-10-26",
    status: "Completed",
  },
  {
    id: "ORD002",
    service: "YouTube Views",
    amount: "5,000",
    price: "$40.00",
    date: "2023-10-25",
    status: "Processing",
  },
  {
    id: "ORD003",
    service: "TikTok Likes",
    amount: "10,000",
    price: "$20.00",
    date: "2023-10-24",
    status: "Completed",
  },
  {
    id: "ORD004",
    service: "Instagram Likes",
    amount: "500",
    price: "$2.50",
    date: "2023-10-23",
    status: "Canceled",
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Completed: "default",
  Processing: "secondary",
  Canceled: "destructive",
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-glow">My Orders</h1>
        <p className="text-muted-foreground">
          Track the status of your recent orders.
        </p>
      </div>
      <Card className="bg-card/80 border-primary/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.service}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{order.price}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={statusVariant[order.status] || "outline"} className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
