'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, AlertTriangle } from 'lucide-react';

function ProductDetailPageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <Skeleton className="rounded-lg h-80 md:h-full bg-card/50" />
                <div className="flex flex-col">
                    <Skeleton className="h-10 w-3/4 mb-4 bg-card/50" />
                    <Skeleton className="h-24 w-full mb-6 bg-card/50" />
                    <Skeleton className="h-12 w-1/3 mb-6 bg-card/50" />
                    <Skeleton className="h-12 w-48 rounded-full bg-card/50" />
                </div>
            </div>
        </div>
    );
}

export default function ProductDetailPage() {
    const { productId } = useParams<{ productId: string }>();
    const firestore = useFirestore();
    const { addToCart } = useCart();

    const productDocRef = useMemoFirebase(() => {
        if (!firestore || !productId) return null;
        return doc(firestore, 'products', productId);
    }, [firestore, productId]);

    const { data: product, isLoading } = useDoc<Omit<Product, 'id'>>(productDocRef);

    if (isLoading) {
        return <ProductDetailPageSkeleton />;
    }

    if (!product) {
        return (
            <div className="text-center py-20 flex flex-col items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h2 className="text-xl font-semibold">Product Not Found</h2>
                <p className="text-muted-foreground mt-2">The product you are looking for does not exist.</p>
            </div>
        );
    }
    
    const fullProduct: Product = { ...product, id: productId };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                        src={fullProduct.imageUrl}
                        alt={fullProduct.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        data-ai-hint={fullProduct.imageHint}
                    />
                </div>
                <div className="flex flex-col h-full py-4">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">{fullProduct.name}</h1>
                    <p className="text-muted-foreground text-lg mb-6">{fullProduct.description}</p>
                    <div className="mt-auto">
                        <div className="flex items-center justify-between">
                            <p className="text-3xl font-bold">₹{fullProduct.price.toFixed(2)}</p>
                            <Button onClick={() => addToCart(fullProduct)} size="lg" className="rounded-full font-semibold hover:brightness-110 transition-all duration-300">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
