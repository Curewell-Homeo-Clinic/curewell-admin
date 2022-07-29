import { getMoney } from "@/utils";
import { format } from "date-fns";
import {
  calculateProductPrice,
  calculateTotalAmmount,
  Invoice,
} from "./InvoicePreview";

export const InvoicePreviewTable: React.FC<{ invoice: Invoice }> = ({
  invoice,
}) => {
  return (
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
              <td className="capitalize">{invoice.patient.name}</td>
            </tr>

            {/* doctor */}
            <tr>
              <td>3</td>
              <td>Doctor</td>
              <td className="capitalize">{invoice.doctor.name}</td>
            </tr>

            {/* doctor */}
            <tr>
              <td>4</td>
              <td>Clinic</td>
              <td>
                #{invoice.clinic.number} {invoice.clinic.name}
              </td>
            </tr>

            {/* plan */}
            <tr>
              <td>4</td>
              <td>Treatment Plan</td>
              <td className="capitalize">{invoice.plan.name}</td>
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
                  <td>{getMoney(calculateProductPrice(product, invoice))}</td>
                </tr>
              ))}

            {/* total ammount */}
            <tr className="border-t-[1px] border-primaryLight">
              <td>{invoice.products.length + 7}</td>
              <td>Total Ammount</td>
              <td>{getMoney(calculateTotalAmmount(invoice))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
