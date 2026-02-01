'use client';

import { SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <h1 className="text-2xl font-bold tracking-tight">
          🛍️ My Online Store
        </h1>
        <SheetTrigger asChild>
          <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Cart ({cartCount})
          </Button>
        </SheetTrigger>
      </div>
    </header>
  );
}
