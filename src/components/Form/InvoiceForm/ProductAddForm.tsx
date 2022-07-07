import { Loader, Modal } from "@/components/shared";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { ShoppingBagIcon } from "@heroicons/react/outline";
import { MultiSelect } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";

const InvoiceProductAddForm: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  optedProductIds: string[];
  invoiceId: string;
  productDiscountPercentage: number;
}> = ({
  show,
  setShow,
  optedProductIds,
  invoiceId,
  productDiscountPercentage,
}) => {
  const { isLoading, data: allProducts } = trpc.useQuery([
    "get_all_products",
    { outOfStock: false },
  ]);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] =
    useState<InferQueryOutput<"get_all_products">>();

  const [products, setProducts] =
    useState<InferQueryOutput<"get_all_products">>();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const trpcCtx = trpc.useContext();
  const addProductsToInvoice = trpc.useMutation("add_invoice_products", {
    onSuccess() {
      trpcCtx.invalidateQueries(["get_invoice_by_id", { id: invoiceId }]);
      trpcCtx.invalidateQueries("get_all_invoices");
      setShow(false);
    },
  });

  const handleSave = async () => {
    if (selectedProducts)
      await addProductsToInvoice.mutateAsync({
        id: invoiceId,
        productDiscountPercentage,
        products: selectedProducts.map((product) => ({
          id: product.id,
          mRP: product.mRP,
        })),
      });
  };

  useEffect(() => {
    if (!isLoading && allProducts) {
      setProducts(
        allProducts.filter((product) => !optedProductIds.includes(product.id))
      );
    }
  }, [allProducts, isLoading]);

  useEffect(() => {
    console.log(products);
  }, [products]);

  useEffect(() => {
    selectedProductIds.length !== 0 &&
      setSelectedProducts(
        products?.filter((product) => selectedProductIds.includes(product.id))
      );
  }, [selectedProductIds, products]);

  useEffect(() => {
    selectedProducts?.length !== 0 ? setIsEdit(true) : setIsEdit(false);
  }, [selectedProducts]);

  if (!allProducts || isLoading)
    return (
      <Modal show={show} setShow={setShow} title="add product">
        <div className="mt-4 min-w-full">
          <Loader />
        </div>
      </Modal>
    );

  return (
    <Modal show={show} setShow={setShow} title="add product">
      <form className="mt-4 min-w-full" onSubmit={(e) => e.preventDefault()}>
        <div className="my-6">
          {products && (
            <MultiSelect
              label="Products"
              description="Products purchased"
              radius="md"
              variant="filled"
              icon={<ShoppingBagIcon className="w-5" />}
              placeholder="Pick product(s)"
              data={products.map((product) => ({
                value: product.id,
                label: product.name,
              }))}
              value={selectedProductIds}
              onChange={(vals) => setSelectedProductIds(vals)}
              searchable
              nothingFound="Oops! nothing found."
            />
          )}
        </div>

        <div className="flex justify-end">
          <button
            className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
            disabled={isEdit ? false : true}
            onClick={handleSave}
          >
            Add
          </button>
        </div>
        <p className="text-secondary px-1 text-sm hover:underline">
          <Link href="/products">View All Products</Link>
        </p>
      </form>
    </Modal>
  );
};

export default InvoiceProductAddForm;
