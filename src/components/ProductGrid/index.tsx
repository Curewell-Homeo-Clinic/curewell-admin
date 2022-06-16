import { Product } from "@prisma/client";
import ProductCard from "./ProductCard";

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div className="p-2 mt-8">
      <div className="flex flex-wrap gap-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
