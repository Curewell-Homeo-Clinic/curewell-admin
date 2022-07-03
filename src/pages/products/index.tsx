import { Loader, Suspense } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import dynamic from "next/dynamic";

const ProductGrid = dynamic(() => import("@/components/ProductGrid"), {
  suspense: true,
});

export default function ProductsPage() {
  const { isLoading, data: products } = trpc.useQuery(["get_all_products", {}]);

  if (isLoading || !products) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Products</h1>
      </div>
      <Suspense>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  );
}
