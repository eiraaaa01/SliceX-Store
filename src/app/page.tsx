import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import { Sheet } from "@/components/ui/sheet";

export default function Home() {
  return (
    <Sheet>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductGrid />
        </main>
        <Cart />
      </div>
    </Sheet>
  );
}
