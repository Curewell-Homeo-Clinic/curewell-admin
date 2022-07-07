import { FormOptions } from "@/components/shared";
import { getMoney } from "@/utils";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { ReceiptTaxIcon, TrashIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InvoiceProductAddForm from "./ProductAddForm";
import ProductRemoveForm from "./ProductRemoveForm";

const InvoiceProductsForm: React.FC<{
  invoice: InferQueryOutput<"get_invoice_by_id">;
}> = ({ invoice }) => {
  const [discountPercentage, setDiscountPercentage] = useState(
    invoice?.productsDiscountPercentage!
  );

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);

  const [isEdit, setIsEdit] = useState(false);

  const trpcCtx = trpc.useContext();
  const updateProductDiscountPercentage = trpc.useMutation(
    "update_invoice_productDiscountPercentage",
    {
      onSuccess() {
        trpcCtx.invalidateQueries(["get_invoice_by_id", { id: invoice?.id! }]);
        trpcCtx.invalidateQueries("get_all_products");
      },
    }
  );

  const handleSave = async () => {
    await updateProductDiscountPercentage.mutateAsync({
      id: invoice?.id!,
      productDiscountPercentage: discountPercentage,
    });
  };

  const handleReset = () => {
    setDiscountPercentage(invoice?.productsDiscountPercentage!);
  };

  useEffect(() => {
    discountPercentage !== invoice?.productsDiscountPercentage
      ? setIsEdit(true)
      : setIsEdit(false);
  }, [discountPercentage, invoice?.productsDiscountPercentage]);

  const router = useRouter();
  const handleViewProduct = (id: string) => router.push(`/products/${id}`);

  if (!invoice || !invoice.products) return null;

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1>Invoice Products Details</h1>
          <p className="secondaryText">Invoice&apos;s Product Details</p>
        </div>
        <button className="btn" onClick={() => setShowAddModal(true)}>
          Add
        </button>
        <InvoiceProductAddForm
          show={showAddModal}
          setShow={setShowAddModal}
          optedProductIds={invoice.products.map((product) => product.id)}
          invoiceId={invoice.id}
          productDiscountPercentage={invoice.productsDiscountPercentage}
        />
      </div>

      {/* The table */}
      <div className="my-6">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden shadow ring-1 ring-primary ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-primary">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                  >
                    MRP
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                  >
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.products.length !== 0 &&
                  invoice.products.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td
                        className="capitalize cursor-pointer hover:underline"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        {product.name}
                      </td>
                      <td>{getMoney(product.mRP)}</td>
                      <td>
                        {getMoney(
                          Math.round(
                            product.mRP -
                              product.mRP *
                                (invoice.productsDiscountPercentage / 100)
                          )
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => setShowDeleteConfirmation(true)}
                          className="hover:bg-red-50 text-secondary hover:text-red-600 disabled:hover:text-primaryLight disabled:cursor-not-allowed select-none focus:ring-2 focus:ring-red-100 rounded p-1 duration-300"
                        >
                          <TrashIcon className="w-5" />
                        </button>
                      </td>
                      <ProductRemoveForm
                        showDeleteConfirmation={showDeleteConfirmation}
                        setShowDeleteConfirmation={setShowDeleteConfirmation}
                        invoiceId={invoice.id}
                        product={{
                          discountPercentage:
                            invoice.productsDiscountPercentage,
                          id: product.id,
                          mRP: product.mRP,
                        }}
                      />
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="discountPercentage"
          className="block mb-2 text-sm font-medium"
        >
          Discount Percentage
          <p className="labelDescription">Discount Percentage on Products</p>
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-primaryLight">
            <ReceiptTaxIcon className="w-5" />
          </div>
          <input
            type="number"
            min="0"
            max="100"
            id="discountPercentage"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 disabled:text-gray-300 disabled:cursor-not-allowed"
            placeholder="200"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(parseInt(e.target.value))}
          />
        </div>
      </div>

      <FormOptions
        isEdit={isEdit}
        handleSave={handleSave}
        handleReset={handleReset}
      />
    </form>
  );
};

export default InvoiceProductsForm;
