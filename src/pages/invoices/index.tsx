import { Loader } from "@/components/shared";
import { InvoicesTable } from "@/components/Table";
import { trpc } from "@/utils/trpc";

export default function InvoicesPage() {
  const { isLoading, data: invoices } = trpc.useQuery(["get_all_invoices"]);
  const { isLoading: isPlansLoading, data: allPlans } = trpc.useQuery([
    "get_all_treatment_plans_skin",
  ]);

  if (isLoading || !invoices || isPlansLoading || !allPlans) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Invoices</h1>
      </div>
      <InvoicesTable invoices={invoices} allPlans={allPlans} />
    </div>
  );
}
