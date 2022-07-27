import { InvoiceDeleteForm, InvoiceForm } from "@/components/Form";
import { GoBackButton, Loader } from "@/components/shared";
import { getMoney } from "@/utils";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function InvoicePage() {
  const router = useRouter();
  const id = router.query.id! as string;

  const { isLoading, data: invoice } = trpc.useQuery(["invoices.get", { id }]);

  if (isLoading || !invoice) return <Loader />;

  return (
    <div>
      <GoBackButton route="/invoices" />
      <div className="mt-8 px-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="secondaryTest">Invoice</p>
            <h1>
              <span
                className="hover:underline cursor-pointer"
                onClick={() => router.push(`/patients/${invoice.patient.id}`)}
              >
                {`${invoice.patient.firstName} ${invoice.patient.lastName}`}
              </span>
              &apos; Invoice - {getMoney(invoice.totalAmmount)}
            </h1>
            <p className="secondaryText">
              Added on {new Date(invoice.timestamp).toLocaleDateString()}
            </p>
          </div>
          {/* delete form */}
          <InvoiceDeleteForm invoice={invoice} />
        </div>
        <InvoiceForm invoice={invoice} />
      </div>
    </div>
  );
}
