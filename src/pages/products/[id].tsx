import { ProductForm } from "@/components/Form";
import { GoBackButton, Loader } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const { isLoading, data: product } = trpc.useQuery([
    "get_product_by_id",
    { id: id! as string },
  ]);

  if (isLoading || !product) return <Loader />;

  return (
    <div>
      <GoBackButton />
      <div className="mt-8 p-2">
        <div className="flex flex-col gap-x-2">
          <p className="secondaryText">Product</p>
          <h1>{product.name}</h1>
          <p className="secondaryText">
            Added at {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </div>

        <ProductForm product={product} />
      </div>
    </div>
  );
}
