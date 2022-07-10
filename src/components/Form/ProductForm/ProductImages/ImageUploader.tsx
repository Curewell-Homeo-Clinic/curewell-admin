import { DropzoneChildren } from "@/components/shared";
import { getExtension } from "@/utils";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import axios from "axios";
import React from "react";

const ProductImageUploader: React.FC<{
  product: InferQueryOutput<"get_product_by_id">;
}> = ({ product }) => {
  const theme = useMantineTheme();

  const getSecureURLMutation = trpc.useMutation([
    "get_product_upload_secure_url",
  ]);

  const trpcCtx = trpc.useContext();
  const addProductImage = trpc.useMutation(["add_product_image_by_id"], {
    onSuccess() {
      trpcCtx.invalidateQueries(["get_product_by_id", { id: product?.id! }]);
      trpcCtx.invalidateQueries(["get_all_products"]);
    },
  });

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    // getting the secure url
    const { imageName, uploadURL } = await getSecureURLMutation.mutateAsync({
      fileExt: getExtension(files[0].name),
    });

    // putting the object
    const res = await axios.put(uploadURL, file, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });

    res &&
      (await addProductImage.mutateAsync({
        productId: product?.id!,
        url: uploadURL.split("?")[0],
        key: imageName,
      }));
  };

  if (!product) return null;

  return (
    <Dropzone
      className="my-6"
      onDrop={(files) => handleUpload(files)}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={10485760}
      accept={IMAGE_MIME_TYPE}
      multiple={false}
    >
      {(status) => DropzoneChildren(status, theme)}
    </Dropzone>
  );
};

export default ProductImageUploader;
