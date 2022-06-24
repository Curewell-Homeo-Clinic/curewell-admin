import { Loader } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import {
  MultiSelect,
  SelectItem,
  TransferList,
  TransferListData,
} from "@mantine/core";
import { PatientTreatmentPlan, TreatmentPlan } from "@prisma/client";
import { useEffect, useState } from "react";
import { TransferListItem } from "worker_threads";

const PatientPlanForm: React.FC<{ plans: PatientTreatmentPlan[] }> = ({
  plans,
}) => {
  const [data, setData] = useState<TransferListData>();

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1>Treatment Plan Details</h1>
      <p className="secondaryText">Patient&apos;s Treatment Plan Details</p>

      <div className="my-6"></div>
    </form>
  );
};

export default PatientPlanForm;
