'use client';

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc, setDoc } from "firebase/firestore";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import type { Product } from "@/lib/types";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLoading } from "@/context/LoadingContext";

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { withLoading } = useLoading();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const productsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Omit<Product, 'id'>>(productsCollectionRef);

  const openNewProductDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };
  
  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };
  
  const handleDeleteProduct = withLoading(async (productId: string) => {
    if (!firestore) return;
    if (confirm('Are you sure you want to delete this product?')) {
        await deleteDoc(doc(firestore, 'products', productId));
        toast({ title: "Product Deleted" });
        window.location.reload();
    }
  });

  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <Button onClick={openNewProductDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Product
            </Button>
        </div>
        <div className="rounded-lg border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">Loading products...</TableCell>
                    </TableRow>
                )}
                {!isLoading && products?.map((product) => (
                <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                    <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrl}
                        width="64"
                    />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => openEditProductDialog(product)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDeleteProduct(product.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        {isDialogOpen && <ProductDialog product={editingProduct} onClose={() => setIsDialogOpen(false)} />}
    </div>
  );
}

function ProductDialog({ product, onClose }: { product: Product | null, onClose: () => void}) {
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price.toString() || '');
    const [description, setDescription] = useState(product?.description || '');
    const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
    const firestore = useFirestore();
    const { toast } = useToast();
    const { withLoading } = useLoading();

    const handleSubmit = withLoading(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;

        const productData = {
            name,
            price: parseFloat(price),
            description,
            imageUrl,
            imageHint: "product " + name.toLowerCase().split(' ').slice(0,2).join(' '),
        };

        const docRef = product ? doc(firestore, 'products', product.id) : doc(collection(firestore, 'products'));

        await setDoc(docRef, productData, { merge: true });

        toast({ title: product ? "Product Updated" : "Product Created" });
        onClose();
        window.location.reload();
    });

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{product ? 'Edit Product' : 'New Product'}</DialogTitle>
                        <DialogDescription>
                            {product ? 'Make changes to this product.' : 'Add a new product to your store.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
