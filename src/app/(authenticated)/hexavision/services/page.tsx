import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const services = [
    { id: 1, name: "Instagram Followers", price: "10.00", min: 100, max: 10000, description: "Real Instagram followers." },
    { id: 2, name: "YouTube Views", price: "5.00", min: 1000, max: 100000, description: "High-quality YouTube views." },
    { id: 3, name: "TikTok Likes", price: "2.50", min: 100, max: 50000, description: "Instant TikTok likes." },
    { id: 4, name: "Twitter Retweets", price: "7.50", min: 50, max: 5000, description: "Get your tweets viral." },
]

export default function ServicesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Services</h1>
       <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Price per 1000</TableHead>
            <TableHead>Min/Max Order</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>₹{service.price}</TableCell>
              <TableCell>{service.min.toLocaleString()} / {service.max.toLocaleString()}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell className="text-right">
                <Button size="sm">Order</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
