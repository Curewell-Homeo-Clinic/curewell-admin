import { Modal } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PlanCreateForm: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ show, setShow }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);

  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();

  const planCreateMutation = trpc.useMutation(["create_treatment_plan"]);

  const handleSave = async () => {
    (await planCreateMutation.mutateAsync({
      name,
      description,
      duration,
      price,
    })) && router.reload();
  };

  useEffect(() => {
    if (name !== "" && description !== "" && duration !== 0 && price !== 0)
      setIsEdit(true);
    else setIsEdit(false);
  }, [name, description, duration, price, isEdit]);

  return (
    <Modal show={show} setShow={setShow} title="add new treatment plan">
      <form className="mt-4 min-w-full" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-6 mt-6">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
            placeholder="Treatment Plant's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={2}
            spellCheck={false}
            maxLength={255}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
            placeholder="Treatment Plan's Description"
          ></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="duration" className="block mb-2 text-sm font-medium">
            Duration (in days)
          </label>
          <input
            type="number"
            id="duration"
            spellCheck={false}
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
            placeholder="15"
            value={duration}
            min="0"
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="price" className="block mb-2 text-sm font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            spellCheck={false}
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
            placeholder="4000"
            value={price}
            min="0"
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
        </div>
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

export default PlanCreateForm;
