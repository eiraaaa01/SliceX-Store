'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, cartCount } = useCart();

  return (
    <SheetContent className="flex flex-col w-full sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Your Cart ({cartCount})</SheetTitle>
      </SheetHeader>
      {cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-grow pr-4 -mr-4">
            <div className="flex flex-col gap-4 my-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                      className="h-7 w-12 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter>
            <div className="w-full text-lg">
              <div className="flex justify-between font-bold py-4 border-t">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <SheetClose asChild>
                <Button className="w-full">Proceed to Checkout</Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-xl text-muted-foreground">Your cart is empty.</p>
          <SheetClose asChild>
            <Button variant="link" className="mt-2">Start shopping</Button>
          </SheetClose>
        </div>
      )}
    </SheetContent>
  );
}
