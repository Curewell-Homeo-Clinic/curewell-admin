import { PlanForm } from "@/components/Form";
import { GoBackButton, Loader } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function PlanPage() {
  const router = useRouter();
  let { id } = router.query;
  id = id as string;

  const { isLoading, data: plan } = trpc.useQuery(["plans.get", { id }]);

  if (isLoading || !plan) return <Loader />;

  return (
    <div>
      <GoBackButton />
      <div className="mt-8 px-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="secondaryText">Plan</p>
            <h1>{plan.name}</h1>
            <p className="secondaryText">
              Created at {new Date(plan.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* Delete form */}
        </div>
        <PlanForm plan={plan} />
      </div>
    </div>
  );
}
