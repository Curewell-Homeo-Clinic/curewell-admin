import { Modal } from "@/components/shared";
import { getMoney } from "@/utils";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { InvoicePreviewTable } from "./InvoicePreviewTable";

export interface Invoice {
  patient: {
    name: string;
    id: string;
  };
  doctor: {
    name: string;
    id: string;
  };
  timestamp: Date;
  plan: {
    id: string;
    name: string;
    price: number;
  };
  consultationFee: number;
  planAmmountPaying: number;
  products: {
    id: string;
    name: string;
    mRP: number;
    quantity: number;
  }[];
  discountPercentage: number;
  clinic: InferQueryOutput<"clinic.getAll">[number];
}

export const calculateProductPrice = (
  product: Invoice["products"][number],
  invoice: Invoice
) => {
  return Math.round(
    product.mRP - product.mRP * (invoice.discountPercentage / 100)
  );
};

export const calculateTotalAmmount = (invoice: Invoice) => {
  let totalAmmount = 0;
  totalAmmount += invoice.consultationFee;
  totalAmmount += invoice.planAmmountPaying;
  totalAmmount += invoice.products
    .map((product) => calculateProductPrice(product, invoice))
    .reduce((x, y) => x + y, 0);

  return totalAmmount;
};

const InvoicePreview: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  invoice: Invoice;
}> = ({ show, setShow, invoice }) => {
  const createInvoiceMutation = trpc.useMutation(["invoices.create"]);
  const router = useRouter();

  const handleCreate = async () => {
    (await createInvoiceMutation.mutateAsync({
      patientId: invoice.patient.id,
      doctorId: invoice.doctor.id,
      consultationFee: invoice.consultationFee,
      patientPlanId: invoice.plan.id,
      planAmmountPaying: invoice.planAmmountPaying,
      products: invoice.products.map((product) => ({
        quantity: product.quantity,
        id: product.id,
      })),
      timestamp: invoice.timestamp.toString(),
      totalAmmount: calculateTotalAmmount(invoice),
      productDiscountPercentage: invoice.discountPercentage,
      clinicId: invoice.clinic.id,
    })) && router.reload();
  };

  return (
    <Modal show={show} setShow={setShow} title="Invoice Preview" maxWidth="2xl">
      {/* preview table */}
      <div className="my-6">
        <InvoicePreviewTable invoice={invoice} />
      </div>

      <div className="flex justify-end gap-x-2">
        <button className="secondaryBtn" onClick={() => setShow(false)}>
          Cancel
        </button>
        <button
          className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
          onClick={() => handleCreate()}
        >
          Create
        </button>
      </div>
    </Modal>
  );
};

export default InvoicePreview;
