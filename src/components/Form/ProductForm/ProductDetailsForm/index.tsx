import { InferQueryOutput, trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProductDetailsForm: React.FC<{
  product: InferQueryOutput<"products.get">;
}> = ({ product }) => {
  const [name, setName] = useState(product?.name!);
  const [mRP, setMRP] = useState(product?.mRP!);
  const [quantity, setQuantity] = useState(product?.quantity!);
  const [isEdit, setIsEdit] = useState(false);

  const trpcCtx = trpc.useContext();
  const productUpdateMutation = trpc.useMutation(["products.update"], {
    async onSuccess() {
      trpcCtx.invalidateQueries(["products.get", { id: product?.id! }]);
      trpcCtx.invalidateQueries(["products.getAll", {}]);
    },
  });

  const handleSave = async () => {
    await productUpdateMutation.mutateAsync({
      id: product?.id!,
      name,
      mRP,
      quantity,
    });
  };

  useEffect(() => {
    if (
      name !== product?.name ||
      mRP !== product?.mRP ||
      quantity !== product?.quantity
    ) {
      setIsEdit(true);
    } else setIsEdit(false);
  }, [name, product?.name, mRP, product?.mRP, quantity, product?.quantity]);

  if (!product) return null;

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1>Product Details</h1>
      <p className="secondaryText">Product&apos;s Information</p>

      {/* Name */}
      <div className="mt-6 mb-6">
        <label htmlFor="productName" className="block mb-2 text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="productName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name, e.g. Shampoo"
          className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
        />
      </div>

      {/* Price */}
      <div className="mb-6">
        <label htmlFor="productMRP" className="block mb-2 text-sm font-medium">
          MRP
        </label>
        <input
          type="number"
          id="productMRP"
          value={mRP}
          min="0"
          onChange={(e) => setMRP(parseInt(e.target.value))}
          className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
        />
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label
          htmlFor="productQuantity"
          className="block mb-2 text-sm font-medium"
        >
          Quantity
        </label>
        <input
          type="number"
          min="0"
          id="productQuantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
          disabled={isEdit ? false : true}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProductDetailsForm;
