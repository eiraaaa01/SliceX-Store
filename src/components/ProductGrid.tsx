'use client';
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import ProductCard from "./ProductCard";
import { collection } from 'firebase/firestore';
import type { Product } from "@/lib/types";
import { useLoading } from "@/context/LoadingContext";
import { useEffect } from "react";

export default function ProductGrid() {
  const firestore = useFirestore();
  const { showLoading, hideLoading } = useLoading();
  const productsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Omit<Product, 'id'>>(productsCollectionRef);
  
  useEffect(() => {
    if (isLoading) {
      showLoading();
      return () => hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
