import { getMoney } from "@/utils";
import { InferQueryOutput } from "@/utils/trpc";
import {
  CurrencyRupeeIcon,
  TemplateIcon,
  TrashIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useState } from "react";

const InvoiceDetailsForm: React.FC<{
  invoice: InferQueryOutput<"get_invoice_by_id">;
}> = ({ invoice }) => {
  const [planAmmountPaying, setPlanAmmountPaying] = useState(
    invoice?.plan.ammountPaid!
  );
  const [consultationFee, setConsultationFee] = useState(
    invoice?.consultationFee!
  );

  const router = useRouter();
  const handleView = (entity: "patient" | "plan", id: string) => {
    router.push(`/${entity}s/${id}`);
  };

  if (!invoice) return null;

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1>Invoice Details</h1>

      {/* Doctor */}
      <div className="my-6">
        <label htmlFor="doctor" className="block mb-2 text-sm font-medium">
          Doctor
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <UserCircleIcon className="w-5" />
          </div>
          <input
            type="text"
            id="doctor"
            className="cursor-alias bg-gray-50 capitalize  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
            placeholder="9090230423"
            maxLength={10}
            disabled
            value={`${invoice.doctor.firstName} ${invoice.doctor.lastName}`}
          />
        </div>
      </div>

      {/* Patient */}
      <div
        className="mb-6"
        onClick={() => handleView("patient", invoice.patient.id)}
      >
        <label htmlFor="patient" className="block mb-2 text-sm font-medium">
          Patient
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <UserIcon className="w-5" />
          </div>
          <input
            type="text"
            id="patient"
            className="cursor-alias bg-gray-50 capitalize  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
            placeholder="9090230423"
            maxLength={10}
            disabled
            value={`${invoice.patient.firstName} ${invoice.patient.lastName}`}
          />
        </div>
      </div>

      {/* Patient Plan */}
      <div
        className="mb-6"
        onClick={() => handleView("plan", invoice.plan.plan.id)}
      >
        <label htmlFor="plan" className="block mb-2 text-sm font-medium">
          Patient&apos;s Treatment Plan
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <TemplateIcon className="w-5" />
          </div>
          <input
            type="text"
            id="plan"
            className="cursor-alias bg-gray-50 capitalize  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
            placeholder="9090230423"
            maxLength={10}
            disabled
            value={invoice.plan.plan.name}
          />
        </div>
      </div>

      {/* Consultation Fee */}
      <div className="mb-6">
        <label
          htmlFor="consultationFee"
          className="block mb-2 text-sm font-medium"
        >
          Consultation Fee
          <p className="labelDescription">Consultation Fee Ammount</p>
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <CurrencyRupeeIcon className="w-5" />
          </div>
          <input
            type="number"
            min="0"
            id="consultationFee"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
            placeholder="200"
            value={consultationFee}
            onChange={(e) => setConsultationFee(parseInt(e.target.value))}
          />
        </div>
      </div>

      {/* Plan Ammount Paying */}
      <div className="mb-6">
        <label
          htmlFor="planAmmountPaying"
          className="block mb-2 text-sm font-medium"
        >
          Plan Ammount Paying
          <p className="labelDescription">
            Ammount paying for treatment plan (Maximum:{" "}
            {getMoney(invoice.plan.plan.price! - invoice.plan.ammountPaid!)})
          </p>
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <CurrencyRupeeIcon className="w-5" />
          </div>
          <input
            type="number"
            min="0"
            max={invoice.plan.plan.price! - invoice.plan.ammountPaid!}
            id="planAmmountPaying"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
            placeholder="200"
            value={planAmmountPaying}
            onChange={(e) => setPlanAmmountPaying(parseInt(e.target.value))}
          />
        </div>
      </div>
    </form>
  );
};

export default InvoiceDetailsForm;
