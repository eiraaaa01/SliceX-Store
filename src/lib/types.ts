export type Product = {
  id: string; // Firestore ID
  name: string;
  price: number;
  originalPrice?: number | null;
  description: string;
  shippingDays?: number | null;
  imageUrl: string;
  imageHint: string;
};
