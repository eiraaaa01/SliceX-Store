import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

const services = [
  {
    platform: "Instagram",
    title: "Followers",
    price: "$10 / 1k",
    description: "High-quality followers to boost your profile.",
  },
  {
    platform: "Instagram",
    title: "Likes",
    price: "$5 / 1k",
    description: "Instant likes on your posts to increase engagement.",
  },
  {
    platform: "TikTok",
    title: "Views",
    price: "$2 / 1k",
    description: "Drive traffic and views to your TikTok videos.",
  },
  {
    platform: "TikTok",
    title: "Followers",
    price: "$15 / 1k",
    description: "Grow your TikTok audience with real followers.",
  },
  {
    platform: "YouTube",
    title: "Views",
    price: "$8 / 1k",
    description: "Increase your YouTube video views and ranking.",
  },
  {
    platform: "YouTube",
    title: "Subscribers",
    price: "$25 / 1k",
    description: "Gain subscribers to grow your YouTube channel.",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <p className="text-muted-foreground">
          Choose a service to boost your social media presence.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service, index) => (
          <Card key={index} className="flex flex-col bg-card/80 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle>{service.platform} {service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-2xl font-bold text-primary">
                {service.price}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full hover:brightness-110 transition-all duration-300">
                <ShoppingCart className="mr-2 h-4 w-4" /> Order Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
