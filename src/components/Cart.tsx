'use client';

import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { ScrollArea } from "./ui/scroll-area";
import { X } from "lucide-react";

export default function Cart() {
  const { cartItems, totalPrice } = useCart();

  return (
    <SheetContent className="flex flex-col w-full sm:max-w-md bg-[#0f1220] border-l border-border p-6">
      <SheetHeader className="flex-row justify-between items-center mb-4">
        <SheetTitle className="text-lg font-bold">Your Cart</SheetTitle>
        <SheetClose asChild>
           <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <X className="h-6 w-6" />
           </Button>
        </SheetClose>
      </SheetHeader>
      
      {cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-grow -mr-6 pr-6">
            <div className="flex flex-col gap-3 my-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.name} &times; {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter>
            <div className="w-full text-lg border-t border-border pt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
        </div>
      )}
    </SheetContent>
  );
}
