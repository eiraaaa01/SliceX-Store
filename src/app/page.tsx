import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import { Sheet } from "@/components/ui/sheet";

export default function Home() {
  return (
    <Sheet>
      <div className="min-h-screen">
        <Header />
        <main>
          <section className="hero py-12 px-6 sm:py-16 lg:py-24 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Shop smarter.<br/>Pay smoother.
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md">
              A Slice-inspired shopping experience with a modern, premium feel.
            </p>
          </section>
          <section className="products-section py-8 px-6 sm:py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ProductGrid />
          </section>
        </main>
        <Cart />
      </div>
    </Sheet>
  );
}
