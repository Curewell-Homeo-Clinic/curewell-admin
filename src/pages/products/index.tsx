import { ProductGrid } from "@/components";
import { Loader } from "@/components/shared";
import { trpc } from "@/utils/trpc";

export default function ProductsPage() {
  const { isLoading, data: products } = trpc.useQuery(["get_all_products", {}]);

  if (isLoading || !products) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Products</h1>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
