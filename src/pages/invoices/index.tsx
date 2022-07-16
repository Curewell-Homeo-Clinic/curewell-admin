import { Loader, Suspense } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import dynamic from "next/dynamic";

const InvoicesTable = dynamic(
  () => import("@/components/Table/InvoicesTable"),
  {
    suspense: true,
  }
);

export default function InvoicesPage() {
  const { isLoading, data: invoices } = trpc.useQuery(["invoices.getAll"]);

  if (isLoading || !invoices) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Invoices</h1>
      </div>
      <Suspense>
        <InvoicesTable invoices={invoices} />
      </Suspense>
    </div>
  );
}
