import { format } from "date-fns";
import Image from "next/image";
import { Image as IImage } from "@prisma/client";
import { TrashIcon } from "@heroicons/react/outline";
import { useState } from "react";
import PatientImageDeleteModal from "./PatientImageDeleteModal";

const ImageCard: React.FC<{
  image: IImage;
  category: "before" | "after" | "report";
  patientId: string;
}> = ({ image, category, patientId }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  return (
    <div
      key={image.id}
      className="flex flex-col gap-x-6 items-end duration-500 cursor-pointer shadow-lg hover:shadow-2xl border-2 border-primary rounded-lg"
    >
      <div className="flex w-full items-center justify-between my-2 px-2">
        <p className="secondaryText">
          {format(new Date(image.createdAt), "dd/MM/yy - EEE")}
        </p>
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="hover:bg-red-50 text-secondary hover:text-red-600 disabled:hover:text-primaryLight disabled:cursor-not-allowed select-none focus:ring-2 focus:ring-red-100 rounded p-1 duration-300"
        >
          <TrashIcon className="w-5" />
        </button>
        <PatientImageDeleteModal
          category={category}
          image={image}
          patientId={patientId}
          setShow={setShowDeleteConfirmation}
          show={showDeleteConfirmation}
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
  );
};

export default ImageCard;
