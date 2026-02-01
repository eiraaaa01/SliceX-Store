export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

export const products: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 149, description: "Premium quality" },
  { id: 2, name: "Smart Watch", price: 229, description: "Premium quality" },
  { id: 3, name: "Minimal Sneakers", price: 189, description: "Premium quality" },
  { id: 4, name: "Premium Backpack", price: 199, description: "Premium quality" }
];
