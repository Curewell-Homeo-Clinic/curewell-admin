import { CloudUploadIcon } from "@heroicons/react/outline";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";

const ProductForm: React.FC<{
  product: Product;
}> = ({ product }) => {
  const [name, setName] = useState(product?.name);
  const [price, setPrice] = useState(product?.price);
  const [quantity, setQuantity] = useState(product?.quantity);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (
      name !== product.name ||
      price !== product.price ||
      quantity !== product.quantity
    ) {
      setIsEdit(true);
    } else setIsEdit(false);
  }, [name, product.name, price, product.price, quantity, product.quantity]);

  if (!product) return null;

  return (
    <div className="flex flex-wrap md:sm:flex-col lg:flex-row gap-10 lg:items-start md:sm:items-stretch justify-between mt-6">
      <form
        style={{ flex: 0.5 }}
        className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1>Product Details</h1>
        <p className="secondaryText">Product&apos;s Information</p>

        {/* Name */}
        <div className="mt-6 mb-6">
          <label
            htmlFor="productName"
            className="block mb-2 text-sm font-medium"
          >
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
            id="productQuantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
          />
        </div>

        {/* Image - To be Implemented */}
        <div className="mb-6">
          <label
            htmlFor="productImage"
            className="block mb-2 text-sm font-medium"
          >
            Image
          </label>
          <div className="flex justify-center items-center w-full">
            <label
              htmlFor="productImage"
              className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col justify-center items-center pt-5 pb-6">
                <CloudUploadIcon className="mb-3 w-10 h-10 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input id="productImage" type="file" className="hidden" />
            </label>
          </div>
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
    </div>
  );
};

export default ProductForm;
