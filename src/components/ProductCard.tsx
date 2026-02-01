'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { useLoading } from "@/context/LoadingContext";
import { usePathname } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { showLoading } = useLoading();
  const pathname = usePathname();

  const handleViewClick = () => {
    if (pathname !== `/product/${product.id}`) {
        showLoading();
    }
  }

  return (
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
            <Button asChild variant="outline" className="w-full rounded-full font-semibold">
              <Link href={`/product/${product.id}`} onClick={handleViewClick}>View</Link>
            </Button>
            <Button onClick={() => addToCart(product)} className="w-full rounded-full font-semibold hover:brightness-110 transition-all duration-300">
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
  );
}
