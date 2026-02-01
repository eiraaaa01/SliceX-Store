'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useMemoFirebase, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// The data stored in Firestore for a cart item
export interface CartItemDocument {
  productId: string;
  quantity: number;
  product: Omit<Product, 'id'>; 
  addedAt: any; // for serverTimestamp
}

// The data we work with in the app (includes product details from the document)
export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  totalPrice: number;
  isCartLoading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const cartCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'cart');
  }, [user, firestore]);

  const { data: cartDocuments, isLoading: isCartLoading } = useCollection<CartItemDocument>(cartCollectionRef);

  const cartItems = useMemo<CartItem[]>(() => {
    if (!cartDocuments) return [];
    return cartDocuments.map(doc => ({
      ...doc.product,
      id: doc.productId,
      quantity: doc.quantity,
    }));
  }, [cartDocuments]);


  const addToCart = (product: Product) => {
    if (!user || !firestore || !cartCollectionRef) {
        toast({
            variant: "destructive",
            title: "Not signed in",
            description: "You must be signed in to add items to your cart.",
        });
        return;
    }

    const cartDocRef = doc(cartCollectionRef, product.id);
    const existingItem = cartDocuments?.find(item => item.productId === product.id);
    const newQuantity = (existingItem?.quantity || 0) + 1;
    
    const { id, ...productData } = product;
    
    const cartItemData = {
        productId: product.id,
        quantity: newQuantity,
        product: productData,
        addedAt: serverTimestamp(),
    };
    
    setDoc(cartDocRef, cartItemData, { merge: true })
        .catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: cartDocRef.path,
                operation: 'write',
                requestResourceData: cartItemData
            }));
        });

    toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    if (!user || !firestore || !cartCollectionRef) return;
    
    const cartDocRef = doc(cartCollectionRef, productId);
    deleteDoc(cartDocRef)
        .catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: cartDocRef.path,
                operation: 'delete'
            }));
        });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!user || !firestore || !cartCollectionRef) return;

    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
        const cartDocRef = doc(cartCollectionRef, productId);
        const updateData = { quantity };
        setDoc(cartDocRef, updateData, { merge: true })
            .catch(err => {
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                    path: cartDocRef.path,
                    operation: 'update',
                    requestResourceData: updateData
                }));
            });
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    cartItems,
    isCartLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
