export type Product = {
  id: string; // Firestore ID
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shippingDays?: number;
  imageUrl: string;
  imageHint: string;
};
