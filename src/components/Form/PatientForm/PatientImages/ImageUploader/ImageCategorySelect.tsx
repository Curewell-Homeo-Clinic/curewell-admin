import { Modal } from "@/components/shared";
import { getExtension } from "@/utils";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { Select, SelectItem } from "@mantine/core";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

const categorySelectData: SelectItem[] = [
  {
    label: "Before Treatment",
    value: "before",
  },
  {
    label: "After Treatment",
    value: "after",
  },
  {
    label: "Test Reports",
    value: "report",
  },
];

const ImageCategorySelect: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  image: File;
  patient: InferQueryOutput<"patients.get">;
}> = ({ show, setShow, image, patient }) => {
  const [category, setCategory] = useState<string | null>();

  const getSecureUploadURL = trpc.useMutation("patients.getUploadSecureURL");

  const trpcCtx = trpc.useContext();
  const uploadMutation = trpc.useMutation("patients.addImage", {
    onSuccess() {
      trpcCtx.invalidateQueries(["patients.get", { id: patient?.id! }]);
      trpcCtx.invalidateQueries(["patients.getAll"]);
      setShow(false);
    },
  });

  const upload = async () => {
    const { imageName, uploadURL } = await getSecureUploadURL.mutateAsync({
      fileExt: getExtension(image.name),
    });
    const res = await axios.put(uploadURL, image, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });

    if (
      (res && category && category === "before") ||
      category === "after" ||
      category === "report"
    ) {
      await uploadMutation.mutateAsync({
        patientId: patient?.id!,
        url: uploadURL.split("?")[0],
        key: imageName,
        category,
      });
    }
  };

  return (
    <Modal show={show} setShow={setShow} title="Upload Patient's Image">
      <form className="mt-4 min-w-full" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-6 flex items-center justify-center">
          <Image
            height={400}
            width={500}
            layout="fixed"
            src={URL.createObjectURL(image)}
            alt={image.name}
            draggable={false}
            className="rounded-lg"
          />
        </div>

        {/* The select */}
        <div className="mb-6">
          <Select
            data={categorySelectData}
            value={category}
            defaultValue="report"
            onChange={setCategory}
          />
        </div>

        <div className="mb-6 flex items-center justify-end">
          <button
            onClick={upload}
            type="button"
            className="text-white mr-2 bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-primaryLight font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
          >
            Upload
          </button>
          <button
            onClick={() => setShow(false)}
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
          >
            No, cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ImageCategorySelect;
