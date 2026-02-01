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

export default function Cart() {
  const { cartItems, totalPrice, isCartLoading } = useCart();

  return (
    <SheetContent className="flex flex-col w-full sm:max-w-md bg-[#0f1220] border-l border-border p-6">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-lg font-bold">Your Cart</SheetTitle>
      </SheetHeader>
      
      {isCartLoading ? (
         <div className="flex flex-col gap-4 my-4 flex-grow">
            <div className="flex justify-between items-center"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-5 w-1/5" /></div>
            <div className="flex justify-between items-center"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-5 w-1/4" /></div>
            <div className="flex justify-between items-center"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-5 w-1/5" /></div>
         </div>
      ) : cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-grow -mr-6 pr-6">
            <div className="flex flex-col gap-3 my-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.name} &times; {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
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
