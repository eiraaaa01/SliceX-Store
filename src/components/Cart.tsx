'use client';

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { ScrollArea } from "./ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Cart() {
  const { cartItems, totalPrice, isCartLoading, removeFromCart } = useCart();

  return (
    <SheetContent className="flex flex-col w-full sm:max-w-md bg-[#0f1220] border-l border-border p-6">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-lg font-bold">Your Cart</SheetTitle>
      </SheetHeader>
      
      {isCartLoading ? (
         <div className="flex flex-col gap-6 my-4 flex-grow">
            <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-4 w-1/5" />
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-4 w-1/4" />
            </div>
         </div>
      ) : cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-grow -mr-6 pr-6">
            <div className="flex flex-col gap-6 my-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 text-sm">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden border flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium line-clamp-2">{item.name}</p>
                    <p className="text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    <Button
                      variant="link"
                      className="text-destructive hover:text-destructive h-auto p-0 text-xs mt-1"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter>
            <div className="w-full text-lg border-t border-border pt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Your cart is empty.</p>
        </div>
      )}
    </SheetContent>
  );
}
