import { Modal } from "@/components/shared";
import { getMoney } from "@/utils";
import { trpc } from "@/utils/trpc";
import { ExclamationIcon } from "@heroicons/react/outline";
import { Alert, Select } from "@mantine/core";
import { TreatmentPlan } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AddPlanForm: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  notOptedPlans: Array<TreatmentPlan>;
  patientId: string;
}> = ({ show, setShow, notOptedPlans, patientId }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(true);

  const router = useRouter();
  const addPlanMutation = trpc.useMutation(["patients.addTreatmentPlan"]);

  const handleSave = async () => {
    selectedPlanId !== "" &&
      (await addPlanMutation.mutateAsync({
        patientId,
        planId: selectedPlanId,
      })) &&
      router.reload();
  };

  useEffect(() => {
    selectedPlanId !== "" ? setIsEdit(true) : setIsEdit(false);
  }, [selectedPlanId]);

  return (
    <Modal show={show} setShow={setShow} title="Add Plan">
      <form className="mt-4 min-w-full" onSubmit={(e) => e.preventDefault()}>
        {showAlert && (
          <Alert
            withCloseButton
            color="red"
            variant="outline"
            icon={<ExclamationIcon className="w-5" />}
            onClose={() => setShowAlert(false)}
          >
            A patient can only have a treatment plan once, you cannot add
            duplicates.
          </Alert>
        )}
        <div className="my-6">
          <Select
            label="Treatment Plan"
            placeholder="Pick a treatment plan"
            data={notOptedPlans.map((plan) => ({
              value: plan.id,
              label: `${plan.name} ~ ${getMoney(plan.price)}`,
            }))}
            value={selectedPlanId}
            clearable
            onChange={(value) => value && setSelectedPlanId(value)}
          ></Select>
        </div>
        <div className="flex justify-end">
          <button
            className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
            disabled={isEdit ? false : true}
            onClick={handleSave}
          >
            Add
          </button>
        </div>
        <p className="text-secondary px-1 text-sm hover:underline">
          <Link href="/plans">View All Plans</Link>
        </p>
      </form>
    </Modal>
  );
};

export default AddPlanForm;
