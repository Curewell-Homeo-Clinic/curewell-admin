import { InferQueryOutput } from "@/utils/trpc";
import { format } from "date-fns";
import Image from "next/image";
import ImageUploader from "./ImageUploader";

const ProductImages: React.FC<{
  product: InferQueryOutput<"get_product_by_id">;
}> = ({ product }) => {
  if (!product) return null;
  return (
    <div
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
    >
      <h1>Images</h1>
      <p className="secondaryText">Product&apos;s Images</p>

      <ImageUploader product={product} />

      {/* Images Grid */}
      <div className="flex flex-wrap gap-4 mb-6">
        {product.images.map((image) => (
          <div
            key={image.id}
            className="flex flex-col gap-x-6 items-end hover:scale-105 duration-500 cursor-pointer"
          >
            <Image
              height={200}
              width={200}
              layout="fixed"
              src={image.url}
              alt={image.id}
              draggable={false}
              className="rounded-md"
            />
            <p className="secondaryText pr-2">
              {format(new Date(image.createdAt), "dd/MM/yy - EEE")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
