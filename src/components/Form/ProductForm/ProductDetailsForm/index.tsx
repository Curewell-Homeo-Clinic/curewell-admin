import { InferQueryOutput } from "@/utils/trpc";
import { useEffect, useState } from "react";

const ProductDetailsForm: React.FC<{
  product: InferQueryOutput<"get_product_by_id">;
}> = ({ product }) => {
  const [name, setName] = useState(product?.name);
  const [price, setPrice] = useState(product?.price);
  const [quantity, setQuantity] = useState(product?.quantity);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (
      name !== product?.name ||
      price !== product?.price ||
      quantity !== product?.quantity
    ) {
      setIsEdit(true);
    } else setIsEdit(false);
  }, [name, product?.name, price, product?.price, quantity, product?.quantity]);

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
        <label
          htmlFor="productPrice"
          className="block mb-2 text-sm font-medium"
        >
          Price
        </label>
        <input
          type="number"
          id="productPrice"
          value={price}
          min="0"
          onChange={(e) => setPrice(parseInt(e.target.value))}
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
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProductDetailsForm;
