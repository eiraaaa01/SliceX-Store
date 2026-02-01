import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { CartProvider } from '@/context/CartContext';
import { FirebaseClientProvider } from '@/firebase';
import { LoadingProvider } from '@/context/LoadingContext';
import LoadingIndicator from '@/components/loading-indicator';

export const metadata: Metadata = {
  title: 'SliceX Store',
  description: 'A SliceX-inspired shopping experience with a modern, premium feel with quality product.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body antialiased',
          'bg-background'
        )}
      >
        <FirebaseClientProvider>
          <LoadingProvider>
            <CartProvider>
              {children}
            </CartProvider>
            <LoadingIndicator />
          </LoadingProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
