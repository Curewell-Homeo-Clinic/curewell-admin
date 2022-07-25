import { InferQueryOutput } from "@/utils/trpc";
import ClinicDetailsForm from "./ClinicDetailsForm";
import ClinicInvoiceTimeline, {
  ClinicInvoiceTimelineProps,
} from "./ClinicInvoiceTimeline";

const ClinicForm: React.FC<{
  clinic: InferQueryOutput<"clinic.get">;
  gt: InferQueryOutput<"clinic.getGT">;
}> = ({ clinic, gt }) => {
  if (!clinic) return null;
  const timeLineData: ClinicInvoiceTimelineProps["data"] = clinic.invoices.map(
    (invoice) => ({
      invoiceId: invoice.id,
      timeStamp: new Date(invoice.timestamp),
      ammount: invoice.totalAmmount,
      patient: {
        name: `${invoice.patient.firstName} ${invoice.patient.lastName}`,
        id: invoice.patient.id,
      },
    })
  );
  return (
    <div className="flex flex-wrap md:sm:flex-col lg:flex-row gap-10 lg:items-start md:sm:items-stretch my-6">
      <div style={{ flex: 0.5 }}>
        <ClinicDetailsForm clinic={clinic} />
      </div>
      {clinic.invoices.length > 0 && (
        <div style={{ flex: 0.5 }}>
          <ClinicInvoiceTimeline data={timeLineData} totalAmmountSum={gt} />
        </div>
      )}
    </div>
  );
};

export default ClinicForm;
