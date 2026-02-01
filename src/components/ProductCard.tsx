'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  return (
    <Dialog>
      <Card className="flex flex-col overflow-hidden rounded-2xl p-5 border-0 shadow-2xl transition-transform ease-in-out duration-200 hover:-translate-y-1.5" style={{ background: 'linear-gradient(180deg, #151823, #111423)'}}>
        <CardContent className="p-0 flex-grow flex flex-col">
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  data-ai-hint={product.imageHint}
              />
          </div>
          <h3 className="text-base font-semibold mb-1 truncate">{product.name}</h3>
          <span className="text-sm text-muted-foreground flex-grow line-clamp-2">{product.description}</span>
          <p className="text-base font-bold my-3">₹{product.price.toFixed(2)}</p>
          <div className="flex gap-2 mt-auto">
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full rounded-full font-semibold">View</Button>
            </DialogTrigger>
            <Button onClick={() => addToCart(product)} className="w-full rounded-full font-semibold hover:brightness-110 transition-all duration-300">
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-md md:max-w-2xl bg-[#0f1220] border-border">
        <div className="grid md:grid-cols-2 gap-6 p-2 md:p-4">
            <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-ai-hint={product.imageHint}
                />
            </div>
            <div className="flex flex-col py-2">
                <DialogHeader className="p-0 text-left mb-4">
                    <DialogTitle className="text-2xl md:text-3xl font-bold">{product.name}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-base text-muted-foreground flex-grow mb-4">
                    {product.description}
                </DialogDescription>
                <div className="flex items-center justify-between mt-auto">
                    <p className="text-2xl font-bold">₹{product.price.toFixed(2)}</p>
                    <Button onClick={() => addToCart(product)} className="rounded-full font-semibold hover:brightness-110 transition-all duration-300">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
