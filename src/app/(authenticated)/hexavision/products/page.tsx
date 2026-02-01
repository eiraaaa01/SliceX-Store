'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { Product } from "@/lib/types";
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLoading } from "@/context/LoadingContext";
import { Skeleton } from "@/components/ui/skeleton";

const emptyProduct: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  imageUrl: '',
  imageHint: '',
  shippingDate: '',
};

export default function ProductsPage() {
  const firestore = useFirestore();
  const productsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsCollectionRef);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const { toast } = useToast();
  const { withLoading } = useLoading();

  const handleAddNew = () => {
    setEditingProduct(emptyProduct);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = withLoading(async (productId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'products', productId));
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
      });
    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Error Deleting Product",
            description: error.message,
        });
    }
  });

  const handleSave = withLoading(async () => {
    if (!firestore || !productsCollectionRef || !editingProduct) return;

    try {
        if ('id' in editingProduct && editingProduct.id) {
            // Update existing product
            const productRef = doc(firestore, 'products', editingProduct.id);
            await setDoc(productRef, editingProduct, { merge: true });
             toast({
                title: "Product Updated",
                description: "The product has been successfully updated.",
            });
        } else {
            // Create new product
            await addDoc(productsCollectionRef, editingProduct);
            toast({
                title: "Product Created",
                description: "The new product has been successfully added.",
            });
        }
        setIsDialogOpen(false);
        setEditingProduct(null);
    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Error Saving Product",
            description: error.message,
        });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditingProduct(prev => ({...prev, [id]: value}));
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditingProduct(prev => ({...prev, [id]: parseFloat(value) || 0}));
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
            </Button>
        </div>
       <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Original Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
             Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : (
            products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                    <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="rounded-md object-cover" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                <TableCell>₹{product.originalPrice?.toFixed(2) ?? 'N/A'}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the product.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(product.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingProduct?.id ? 'update the' : 'create a new'} product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={editingProduct?.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={editingProduct?.description} onChange={handleInputChange} />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="price">Selling Price (₹)</Label>
                    <Input id="price" type="number" value={editingProduct?.price} onChange={handleNumberInputChange} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input id="originalPrice" type="number" value={editingProduct?.originalPrice} onChange={handleNumberInputChange} />
                </div>
             </div>
             <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" value={editingProduct?.imageUrl} onChange={handleInputChange} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="imageHint">Image Hint (for AI)</Label>
              <Input id="imageHint" value={editingProduct?.imageHint} onChange={handleInputChange} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="shippingDate">Shipping Date</Label>
              <Input id="shippingDate" type="date" value={editingProduct?.shippingDate} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
