import { Loader } from "@/components/shared";
import { InvoicesTable } from "@/components/Table";
import { trpc } from "@/utils/trpc";

export default function InvoicesPage() {
  const { isLoading, data: invoices } = trpc.useQuery(["get_all_invoices"]);

  if (isLoading || !invoices) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Invoices</h1>
      </div>
      <InvoicesTable invoices={invoices} />
    </div>
  );
}
