import { trpc } from "@/utils/trpc";
import { ExclamationCircleIcon, XIcon } from "@heroicons/react/outline";

const ProductRemoveForm: React.FC<{
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceId: string;
  product: {
    id: string;
    mRP: number;
    discountPercentage: number;
  };
}> = ({
  setShowDeleteConfirmation,
  showDeleteConfirmation,
  invoiceId,
  product,
}) => {
  const trpcCtx = trpc.useContext();
  const removeProduct = trpc.useMutation("remove_invoice_product", {
    onSuccess() {
      trpcCtx.invalidateQueries(["get_invoice_by_id", { id: invoiceId }]);
      trpcCtx.invalidateQueries("get_all_products");
      setShowDeleteConfirmation(false);
    },
  });
  const handleDelete = async () => {
    await removeProduct.mutateAsync({
      id: invoiceId,
      product: {
        id: product.id,
        mRP: product.mRP,
      },
      productDiscountPercentage: product.discountPercentage,
    });
  };

  return (
    <div
      tabIndex={-1}
      className={`${
        !showDeleteConfirmation && "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 md:inset-0 h-modal md:h-full flex items-center justify-center`}
      style={{
        background: "rgba(8, 26, 81, 0.5)",
      }}
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow-lg">
          <button
            type="button"
            onClick={() => setShowDeleteConfirmation(false)}
            className="absolute top-3 right-2.5 text-primary bg-transparent hover:bg-primaryLight hover:text-secondary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <XIcon className="w-5" />
          </button>
          <div className="p-6 text-center">
            <ExclamationCircleIcon className="mx-auto mb-4 w-14 h-14 text-secondary" />
            <h3 className="mb-5 text-lg font-normal text-secondary">
              Are you sure you want to remove this product from the invoice?
            </h3>
            <button
              onClick={handleDelete}
              type="button"
              className="text-white mr-2 bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              Yes, I&apos;m sure
            </button>
            <button
              onClick={() => setShowDeleteConfirmation(false)}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRemoveForm;
