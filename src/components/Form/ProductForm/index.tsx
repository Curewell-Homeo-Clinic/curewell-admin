import { InferQueryOutput } from "@/utils/trpc";
import { Product } from "@prisma/client";
import ProductDetailsForm from "./ProductDetailsForm";
import ProductImages from "./ProductImages";

const ProductForm: React.FC<{
  product: InferQueryOutput<"get_product_by_id">;
}> = ({ product }) => {
  if (!product) return null;

  return (
    <div className="flex flex-wrap md:sm:flex-col lg:flex-row gap-10 lg:items-start md:sm:items-stretch mt-6">
      <ProductDetailsForm product={product} />
      <ProductImages product={product} />
    </div>
  );
};

export default ProductForm;
