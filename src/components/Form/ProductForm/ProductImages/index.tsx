import { InferQueryOutput } from "@/utils/trpc";
import { Checkbox } from "@mantine/core";
import { Image as IImage } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductImageUploader from "./ImageUploader";
import ProductImagesDeleteModal from "./ProductImagesDeleteModal";

const ProductImages: React.FC<{
  product: InferQueryOutput<"products.get">;
}> = ({ product }) => {
  const [selectedImages, setSelectedImages] = useState<IImage[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleSelect = (image: IImage) => {
    selectedImages.includes(image)
      ? // filter out if already present
        setSelectedImages((alreadySelected) =>
          alreadySelected.filter(
            (selectedImage) => selectedImage !== image && selectedImage
          )
        )
      : // push if present
        setSelectedImages((alreadySelected) => [...alreadySelected, image]);
  };

  useEffect(() => {
    // ERROR: ifIsAllSelected is false from selecting images one by one the previously selected ones also getDeleted
    isAllSelected ? setSelectedImages(product?.images!) : setSelectedImages([]);
  }, [isAllSelected, product?.images]);

  useEffect(() => {
    selectedImages.length === product?.images.length
      ? setIsAllSelected(true)
      : setIsAllSelected(false);
  }, [selectedImages, product?.images]);

  if (!product) return null;

  return (
    <div
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
    >
      <h1>Images</h1>
      <p className="secondaryText">Product&apos;s Images</p>

      <ProductImageUploader product={product} />

      {/* Images Grid */}
      <div className="flex items-center justify-between w-full mb-6 gap-2">
        <Checkbox
          label="Select All"
          disabled={product.images.length === 0}
          checked={isAllSelected}
          onChange={() => setIsAllSelected(!isAllSelected)}
        />
        <button
          className="disabledBtn"
          disabled={selectedImages.length === 0}
          onClick={() => setShowDeleteConfirmation(true)}
        >
          Delete
        </button>
        <ProductImagesDeleteModal
          show={showDeleteConfirmation}
          setShow={setShowDeleteConfirmation}
          productId={product.id}
          selectedImages={selectedImages}
        />
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        {product.images.map((image) => (
          <div
            key={image.id}
            className="flex flex-col gap-x-6 items-end duration-500 cursor-pointer shadow-lg hover:shadow-2xl border-2 border-primary rounded-lg"
          >
            <div className="flex w-full items-center justify-between my-2 px-2">
              <p className="secondaryText">
                {format(new Date(image.createdAt), "dd/MM/yy - EEE")}
              </p>
              <Checkbox
                color="dark"
                checked={selectedImages.includes(image)}
                onChange={() => handleSelect(image)}
              />
            </div>
            <Image
              height={200}
              width={200}
              layout="fixed"
              src={image.url}
              alt={image.id}
              draggable={false}
              className="rounded-b-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
