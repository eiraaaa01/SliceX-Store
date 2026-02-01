export type Product = {
  id: string; // Firestore ID
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shippingDate?: string;
  imageUrl: string;
  imageHint: string;
};
