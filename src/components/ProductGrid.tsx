'use client';
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import ProductCard from "./ProductCard";
import { collection } from 'firebase/firestore';
import { Skeleton } from "./ui/skeleton";
import type { Product } from "@/lib/types";

function ProductSkeleton() {
    return (
        <div className="flex flex-col gap-2 p-5 rounded-2xl" style={{ background: 'linear-gradient(180deg, #151823, #111423)'}}>
            <Skeleton className="h-48 rounded-lg bg-card/50" />
            <Skeleton className="h-6 w-3/4 mt-4 bg-card/50" />
            <Skeleton className="h-4 w-full mt-1 bg-card/50" />
            <Skeleton className="h-6 w-1/4 mt-3 bg-card/50" />
            <Skeleton className="h-10 w-full rounded-full mt-3 bg-card/50" />
        </div>
    );
}


export default function ProductGrid() {
  const firestore = useFirestore();
  const productsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Omit<Product, 'id'>>(productsCollectionRef);
  
  if (isLoading) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
