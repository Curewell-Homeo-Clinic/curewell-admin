import { InferQueryOutput, trpc } from "@/utils/trpc";
import { PhotographIcon, UploadIcon, XIcon } from "@heroicons/react/outline";
import { Group, MantineTheme, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  style,
}: {
  status: DropzoneStatus;
  style: { color: string };
}) {
  if (status.accepted) return <UploadIcon style={style} className="w-20" />;

  if (status.rejected) return <XIcon style={style} className="w-20" />;

  return <PhotographIcon style={style} className="w-20" />;
}

const dropZoneChildren = (status: DropzoneStatus, theme: MantineTheme) => {
  return (
    <Group
      position="center"
      spacing="xl"
      style={{ minHeight: 220, pointerEvents: "none" }}
    >
      <ImageUploadIcon
        status={status}
        style={{ color: getIconColor(status, theme) }}
      />

      <div>
        <Text size="xl" inline>
          Drag images here or click to select files
        </Text>
        <Text size="sm" color="dimmed" inline mt={7}>
          Attach as many files as you like, each file should not exceed 5mb
        </Text>
      </div>
    </Group>
  );
};

const ImageUploader: React.FC<{
  product: InferQueryOutput<"get_product_by_id">;
}> = ({ product }) => {
  const theme = useMantineTheme();

  const getSecureURLMutation = trpc.useMutation([
    "get_product_upload_secure_url",
  ]);

  const addProductImage = trpc.useMutation(["add_product_image_by_id"]);

  const router = useRouter();

  const handleUpload = async (files: File[]) => {
    // getting the secure url
    const url = await getSecureURLMutation.mutateAsync();

    // putting the object
    const file = files[0];
    const res = await axios.put(url, file, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });

    res &&
      (await addProductImage.mutateAsync({
        productId: product?.id!,
        url: url.split("?")[0],
      }));
    router.reload();
  };

  if (!product) return null;

  return (
    <Dropzone
      className="my-6"
      onDrop={(files) => handleUpload(files)}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={10485760}
      accept={IMAGE_MIME_TYPE}
    >
      {(status) => dropZoneChildren(status, theme)}
    </Dropzone>
  );
};

export default ImageUploader;
