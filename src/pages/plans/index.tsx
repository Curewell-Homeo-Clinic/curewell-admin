import { Loader, Suspense } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import dynamic from "next/dynamic";

const PlansTable = dynamic(() => import("@/components/Table/PlansTable"), {
  suspense: true,
});

export default function PlansPage() {
  const { isLoading, data: treatmentPlans } = trpc.useQuery([
    "get_all_treatment_plans",
  ]);

  if (isLoading || !treatmentPlans) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Treatment Plans</h1>
      </div>
      <Suspense>
        <PlansTable plans={treatmentPlans} />
      </Suspense>
    </div>
  );
}
