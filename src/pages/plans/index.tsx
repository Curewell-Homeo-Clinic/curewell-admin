import { Loader } from "@/components/shared";
import { PlansTable } from "@/components/Table";
import { trpc } from "@/utils/trpc";

export default function PlansPage() {
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
    <div>
      <div className="p-2">
        <h1>Treatment Plans</h1>
      </div>
      <PlansTable plans={treatmentPlans} />
    </div>
  );
}
