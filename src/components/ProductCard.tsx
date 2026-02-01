'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl p-5 border-0 shadow-2xl transition-transform ease-in-out duration-200 hover:-translate-y-1.5" style={{ background: 'linear-gradient(180deg, #151823, #111423)'}}>
      <div className="relative w-full h-44 mb-3">
          <Image
            src={product.img}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-xl"
            data-ai-hint="product image"
          />
        </div>
      <CardContent className="p-0 flex-grow flex flex-col">
        <h3 className="text-base font-semibold mb-1">{product.name}</h3>
        <span className="text-sm text-muted-foreground">{product.description}</span>
        <p className="text-base font-bold my-3">${product.price}</p>
        <Button onClick={() => addToCart(product)} className="w-full rounded-full font-semibold mt-auto">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
