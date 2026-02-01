export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  description: string;
};

export const products: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 59, img: "https://picsum.photos/seed/1/400/400", description: "High-fidelity sound, all-day comfort." },
  { id: 2, name: "Smart Fitness Watch", price: 99, img: "https://picsum.photos/seed/2/400/400", description: "Track your fitness goals with style." },
  { id: 3, name: "Urban Sneakers", price: 79, img: "https://picsum.photos/seed/3/400/400", description: "Comfortable and stylish for everyday wear." },
  { id: 4, name: "Everyday Backpack", price: 49, img: "https://picsum.photos/seed/4/400/400", description: "Durable and spacious for all your needs." },
  { id: 5, name: "Retro Sunglasses", price: 29, img: "https://picsum.photos/seed/5/400/400", description: "Protect your eyes with a timeless look." },
  { id: 6, name: "Portable Speaker", price: 69, img: "https://picsum.photos/seed/6/400/400", description: "Big sound that you can take anywhere." },
  { id: 7, name: "Minimalist Wallet", price: 39, img: "https://picsum.photos/seed/7/400/400", description: "Slim, secure, and stylishly simple." },
  { id: 8, name: "Gourmet Coffee Beans", price: 25, img: "https://picsum.photos/seed/8/400/400", description: "Start your day with a perfect brew." },
];
