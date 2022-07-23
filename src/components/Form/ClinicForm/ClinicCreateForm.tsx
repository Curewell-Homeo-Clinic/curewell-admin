import { trpc } from "@/utils/trpc";
import { Modal } from "@/components/shared";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ClinicCreateForm: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ show, setShow }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();
  const mutation = trpc.useMutation("clinic.create", {
    onSuccess() {
      router.reload();
    },
  });

  const handleSave = async () => {
    await mutation.mutateAsync({
      address,
      name,
    });
  };

  const handleReset = () => {
    setName("");
    setAddress("");

    setIsEdit(false);
  };

  useEffect(() => {
    if (name !== "" && address !== "") setIsEdit(true);
    else setIsEdit(false);
  }, [name, address, isEdit]);

  return (
    <Modal show={show} setShow={setShow} title="add new clinic">
      <form className="mt-4 min-w-full" onSubmit={(e) => e.preventDefault()}>
        <div className="my-6">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
            placeholder="Clinic's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="address" className="block mb-2 text-sm font-medium">
            Address
          </label>
          <textarea
            id="address"
            rows={10}
            spellCheck={false}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
            placeholder="Clinic's Full Address"
          ></textarea>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
            disabled={isEdit ? false : true}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClinicCreateForm;
