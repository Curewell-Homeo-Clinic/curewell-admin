import { trpc } from "@/utils/trpc";
import { Loader } from "../shared";
import { PlansTable } from "../Table";

export default function PlansSettings() {
  const { isLoading, data: treatmentPlans } = trpc.useQuery([
    "get_all_treatment_plans",
  ]);

  if (isLoading || !treatmentPlans)
    return (
      <div className="flex items-center -justify-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="p-2">
      <PlansTable plans={treatmentPlans} />
    </div>
  );
}
