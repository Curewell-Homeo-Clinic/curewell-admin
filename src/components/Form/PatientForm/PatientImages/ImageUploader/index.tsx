import { DropzoneChildren } from "@/components/shared";
import { InferQueryOutput } from "@/utils/trpc";
import { useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import ImageCategorySelect from "./ImageCategorySelect";
import { useState } from "react";

const PatientImageUploader: React.FC<{
  patient: InferQueryOutput<"patients.get">;
}> = ({ patient }) => {
  const theme = useMantineTheme();
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [image, setImage] = useState<File>();

  const handleUpload = (files: File[]) => {
    setImage(files[0]);
    setShowCategorySelect(!showCategorySelect);
  };

  if (!patient) return null;

  return (
    <div>
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
      {image && (
        <ImageCategorySelect
          show={showCategorySelect}
          setShow={setShowCategorySelect}
          image={image}
          patient={patient}
        />
      )}
    </div>
  );
};

export default PatientImageUploader;
