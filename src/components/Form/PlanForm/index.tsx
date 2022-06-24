import { FormOptions } from "@/components/shared";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PlanForm: React.FC<{
  plan: InferQueryOutput<"get_plan_by_id">;
}> = ({ plan }) => {
  const [name, setName] = useState(plan?.name!);
  const [description, setDescription] = useState(plan?.description!);
  const [duration, setDuration] = useState(plan?.duration!);
  const [price, setPrice] = useState(plan?.price!);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleReset = () => {
    setName(plan?.name!);
    setDescription(plan?.description!);
    setDuration(plan?.duration!);
    setPrice(plan?.price!);

    setIsEdit(false);
  };

  const router = useRouter();

  const updatePlanMutation = trpc.useMutation(["update_treatment_plan"]);

  const handleSave = async () => {
    (await updatePlanMutation.mutateAsync({
      id: plan?.id!,
      name,
      description,
      duration,
      price,
    })) && router.reload();
  };

  useEffect(() => {
    if (
      name !== plan?.name ||
      description !== plan?.description ||
      duration !== plan?.duration ||
      price !== plan.price
    )
      setIsEdit(true);
    else setIsEdit(false);
  }, [
    name,
    plan?.name,
    description,
    plan?.description,
    price,
    plan?.price,
    duration,
    plan?.duration,
    isEdit,
  ]);

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1>Plan Details</h1>
      <p className="secondaryText">Treatment Plan&apos;s Details</p>
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
        <label htmlFor="description" className="block mb-2 text-sm font-medium">
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
      <FormOptions
        handleReset={handleReset}
        handleSave={handleSave}
        isEdit={isEdit}
      />
    </form>
  );
};

export default PlanForm;
