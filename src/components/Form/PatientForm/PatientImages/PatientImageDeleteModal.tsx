import { ExclamationCircleIcon, XIcon } from "@heroicons/react/outline";
import { Image as IImage } from "@prisma/client";
import Image from "next/image";
import { trpc } from "@/utils/trpc";

const PatientImageDeleteModal: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: string;
  image: IImage;
  category: "before" | "after" | "report";
}> = ({ show, setShow, patientId, image, category }) => {
  const trpcCtx = trpc.useContext();
  const deleteImage = trpc.useMutation("delete_patient_image_by_id", {
    onSuccess() {
      trpcCtx.invalidateQueries(["get_patient_by_id", { id: patientId }]);
      trpcCtx.invalidateQueries(["get_all_patients"]);
      setShow(false);
    },
  });

  const handleDelete = async () => {
    await deleteImage.mutateAsync({
      patientId: patientId,
      image: {
        id: image.id,
        objectKey: image.objectKey,
      },
      category: category,
    });
  };

  return (
    <div
      tabIndex={-1}
      className={`${
        !show && "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 md:inset-0 h-modal md:h-full flex items-center justify-center`}
      style={{
        background: "rgba(8, 26, 81, 0.5)",
      }}
    >
      <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow-lg">
          <button
            type="button"
            onClick={() => setShow(false)}
            className="absolute top-3 right-2.5 text-primary bg-transparent hover:bg-primaryLight hover:text-secondary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <XIcon className="w-5" />
          </button>
          <div className="p-6 text-center">
            <ExclamationCircleIcon className="mx-auto mb-4 w-14 h-14 text-secondary" />
            <h3 className="mb-5 text-lg font-normal text-secondary">
              Are you sure you want to delete this patient images?
            </h3>
            <div className="flex items-center justify-center duration-500 cursor-pointer mb-6">
              <Image
                height={200}
                width={200}
                layout="fixed"
                src={image.url}
                alt={image.id}
                draggable={false}
                className="rounded-lg"
              />
            </div>
            <button
              onClick={handleDelete}
              type="button"
              className="text-white mr-2 bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              Yes, I&apos;m sure
            </button>
            <button
              onClick={() => setShow(false)}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientImageDeleteModal;
