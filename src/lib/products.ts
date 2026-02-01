export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  description: string;
};

export const products: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 149, img: "https://picsum.photos/seed/11/500/300", description: "Premium quality" },
  { id: 2, name: "Smart Watch", price: 229, img: "https://picsum.photos/seed/12/500/300", description: "Premium quality" },
  { id: 3, name: "Minimal Sneakers", price: 189, img: "https://picsum.photos/seed/13/500/300", description: "Premium quality" },
  { id: 4, name: "Premium Backpack", price: 199, img: "https://picsum.photos/seed/14/500/300", description: "Premium quality" }
];
