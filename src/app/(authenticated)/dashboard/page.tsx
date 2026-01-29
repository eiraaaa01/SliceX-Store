import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { DollarSign, ListOrdered, Users, ArrowUp } from "lucide-react";

const statCards = [
  {
    title: "Total Spent",
    amount: "$45,231.89",
    change: "+20.1% from last month",
    icon: <DollarSign className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Total Orders",
    amount: "2,350",
    change: "+180.1% from last month",
    icon: <ListOrdered className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Followers Gained",
    amount: "+1,234,567",
    change: "+19% from last month",
    icon: <Users className="h-6 w-6 text-muted-foreground" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-glow">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s a summary of your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <Card key={index} className="bg-card/80 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.amount}</div>
              <p className="text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div>
        <Card className="bg-card/80 border-primary/20 backdrop-blur-sm">
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
