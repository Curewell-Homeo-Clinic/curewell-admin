import { Suspense } from "@/components/shared";
import { InferQueryOutput } from "@/utils/trpc";
import dynamic from "next/dynamic";
import InvoiceProductsForm from "./InvoiceProductsForm";

const InvoiceDetailsForm = dynamic(() => import("./InvoiceDetailsForm"), {
  suspense: true,
});

const InvoiceForm: React.FC<{
  invoice: InferQueryOutput<"get_invoice_by_id">;
}> = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="flex flex-wrap md:sm:flex-col lg:flex-row gap-10 lg:items-start md:sm:items-stretch mt-6">
      <div className="flex flex-col gap-6" style={{ flex: 0.5 }}>
        <Suspense>
          <InvoiceDetailsForm invoice={invoice} />
          <InvoiceProductsForm invoice={invoice} />
        </Suspense>
      </div>
      <div className="flex flex-col gap-6" style={{ flex: 0.5 }}></div>
    </div>
  );
};

export default InvoiceForm;
