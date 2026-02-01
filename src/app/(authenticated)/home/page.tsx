import ProductGrid from "@/components/ProductGrid";

export default function HomePage() {
  return (
    <>
      <section className="hero py-12 px-6 sm:py-16 lg:py-24 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
          Shop smarter.<br/>Pay smoother.
        </h2>
        <p className="text-muted-foreground mt-3 max-w-md">
          A SliceX-inspired shopping experience with a modern, premium feel.
        </p>
      </section>
      <section className="products-section py-8 px-6 sm:py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ProductGrid />
      </section>
    </>
  );
}
