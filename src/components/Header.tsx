'use client';

import { SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { cartCount } = useCart();

  return (
    <nav className="flex justify-between items-center py-5 px-6 max-w-7xl mx-auto">
        <h1 className="text-lg font-bold">
          Slice Store
        </h1>
        <SheetTrigger asChild>
          <Button className="rounded-full font-semibold px-6">
            Cart ({cartCount})
          </Button>
        </SheetTrigger>
      </nav>
  );
}
