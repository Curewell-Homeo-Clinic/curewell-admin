import { Modal } from "@/components/shared";
import { getMoney } from "@/utils";
import { trpc } from "@/utils/trpc";
import { format } from "date-fns";
import { useRouter } from "next/router";

interface Invoice {
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
    previouslyPaid: number;
  };
  consultationFee: number;
  planAmmountPaying: number;
  products: {
    id: string;
    name: string;
    mrp: number;
    discountPercentage: number;
    oldQuantity: number;
    quantity: number;
  }[];
}

const InvoicePreview: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  invoice: Invoice;
}> = ({ show, setShow, invoice }) => {
  const calculateProductPrice: (
    product: Invoice["products"][number]
  ) => number = (product) => {
    return Math.round(
      product.mrp - product.mrp * (product.discountPercentage / 100)
    );
  };

  const calculateTotalAmmount = () => {
    let totalAmmount = 0;
    totalAmmount += invoice.consultationFee;
    totalAmmount += invoice.planAmmountPaying;
    totalAmmount += invoice.products
      .map((product) => calculateProductPrice(product))
      .reduce((x, y) => x + y, 0);

    return totalAmmount;
  };

  const createInvoiceMutation = trpc.useMutation(["create_invoice"]);
  const router = useRouter();

  const handleCreate = async () => {
    (await createInvoiceMutation.mutateAsync({
      patientId: invoice.patient.id,
      doctorId: invoice.doctor.id,
      consultationFee: invoice.consultationFee,
      patientPlanId: invoice.plan.id,
      planAmmountPaying: invoice.planAmmountPaying,
      planPaidAmmount: invoice.plan.previouslyPaid,
      products: invoice.products.map((product) => ({
        oldQuantity: product.oldQuantity,
        quantity: product.quantity,
        id: product.id,
      })),
      timestamp: invoice.timestamp.toString(),
      totalAmmount: calculateTotalAmmount(),
    })) && router.reload();
  };

  return (
    <Modal show={show} setShow={setShow} title="Invoice Preview" maxWidth="2xl">
      {/* preview table */}
      <div className="my-6">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden shadow ring-1 ring-primary ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-primary">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                  >
                    Field
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                  >
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* timestamp */}
                <tr>
                  <td>1</td>
                  <td>Date and Time</td>
                  <td>{format(invoice.timestamp, "dd/MM/yy - HH:mm")}</td>
                </tr>

                {/* patient */}
                <tr>
                  <td>2</td>
                  <td>Patient</td>
                  <td>{invoice.patient.name}</td>
                </tr>

                {/* doctor */}
                <tr>
                  <td>3</td>
                  <td>Doctor</td>
                  <td>{invoice.doctor.name}</td>
                </tr>

                {/* plan */}
                <tr>
                  <td>4</td>
                  <td>Treatment Plan</td>
                  <td>{invoice.plan.name}</td>
                </tr>

                {/* treatment plan ammount */}
                <tr>
                  <td>5</td>
                  <td>
                    Treatment Plan Ammount{" "}
                    <p className="labelDescription">
                      Ammount paid for the treatment plan
                    </p>
                  </td>
                  <td>{getMoney(invoice.planAmmountPaying)}</td>
                </tr>

                {/* consultation fee */}
                <tr>
                  <td>6</td>
                  <td>Consultation Fee</td>
                  <td>{getMoney(invoice.consultationFee)}</td>
                </tr>

                {/* products */}
                {invoice.products.length !== 0 &&
                  invoice.products.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 7}</td>
                      <td>{product.name}</td>
                      <td>{getMoney(calculateProductPrice(product))}</td>
                    </tr>
                  ))}

                {/* total ammount */}
                <tr>
                  <td>{invoice.products.length + 7}</td>
                  <td>Total Ammount</td>
                  <td>{getMoney(calculateTotalAmmount())}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
