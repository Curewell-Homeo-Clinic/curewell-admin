import { ProductDeleteForm, ProductForm } from "@/components/Form";
import { GoBackButton, Loader } from "@/components/shared";
import { getMoney } from "@/utils";
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
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="secondaryText">Product</p>
            <h1>
              <span className="underline underline-offset-2">
                {product.name}
              </span>{" "}
              @ {getMoney(product.price)}
              <span className="secondaryText"> (10% OFF)</span>
            </h1>
            <p className="secondaryText">
              Added at {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>

          {product.invoices.length === 0 && (
            <ProductDeleteForm id={id! as string} />
          )}
        </div>
        <ProductForm product={product} />
      </div>
    </div>
  );
}
