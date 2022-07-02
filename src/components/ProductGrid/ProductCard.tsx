import { getMoney } from "@/utils";
import { InferQueryOutput } from "@/utils/trpc";
import Image from "next/image";
import { useRouter } from "next/router";

const ProductCard: React.FC<{
  product: InferQueryOutput<"get_all_products">[number];
}> = ({ product }) => {
  const router = useRouter();
  return (
    <div
      className="flex items-center flex-col border-2 border-primary rounded-lg p-4 shadow-lg hover:shadow-2xl drop-shadow-xl duration-500 ease-out cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <Image
        height={300}
        width={300}
        layout="fixed"
        placeholder="empty"
        alt={product.name}
        src={
          product.images.length > 0
            ? product.images[0].url
            : "https://www.functionofbeauty.com/product/shampoo-conditioner/img/carousel-4.jpg"
        }
        className="rounded-lg shadow-md"
      />
      <div className="flex flex-col items-start mt-4 w-full">
        <div className="flex items-center justify-between w-full mb-2">
          <span className="font-medium text-xl">{getMoney(product.price)}</span>
          <span className="text-sm">{product.quantity} Left</span>
        </div>
        <span className="text-lg">{product.name}</span>
        <span className="text-sm text-secondary">
          Added on {new Date(product.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
