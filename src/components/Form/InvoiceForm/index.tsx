import { Suspense } from "@/components/shared";
import { InferQueryOutput } from "@/utils/trpc";
import dynamic from "next/dynamic";
import { InvoicePreviewTable } from "./InvoicePreviewTable";
import InvoiceProductsForm from "./InvoiceProductsForm";

const InvoiceDetailsForm = dynamic(() => import("./InvoiceDetailsForm"), {
  suspense: true,
});

const InvoiceForm: React.FC<{
  invoice: InferQueryOutput<"invoices.get">;
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
      <div className="flex flex-col gap-6" style={{ flex: 0.5 }}>
        <div className="mt-2">
          <InvoicePreviewTable
            invoice={{
              clinic: invoice.clinic!,
              doctor: {
                name: `${invoice.doctor!.firstName} ${
                  invoice.doctor!.lastName
                }`,
                id: invoice.doctor!.id,
              },
              patient: {
                name: `${invoice.patient!.firstName} ${
                  invoice.patient!.lastName
                }`,
                id: invoice.patient!.id,
              },
              products: invoice.products.map((product) => ({
                id: product.id,
                name: product.name,
                mRP: product.mRP,
                quantity: product.quantity,
              })),
              consultationFee: invoice.consultationFee,
              discountPercentage: invoice.productsDiscountPercentage,
              plan: {
                id: invoice.plan!.plan.id,
                name: invoice.plan!.plan.name,
                price: invoice.plan!.plan.price,
              },
              planAmmountPaying: invoice.planAmmountPaying,
              timestamp: new Date(invoice.timestamp),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
