import { getMoney } from "@/utils";
import { CurrencyRupeeIcon } from "@heroicons/react/outline";
import { Timeline } from "@mantine/core";
import { format } from "date-fns";
import Link from "next/link";

export type ClinicInvoiceTimelineProps = {
  data: {
    invoiceId: string;
    timeStamp: Date;
    ammount: number;
    patient: { name: string; id: string };
  }[];
};

const ClinicInvoiceTimeline: React.FC<ClinicInvoiceTimelineProps> = ({
  data,
}) => {
  return (
    <div className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center">
      <h1>Invoices</h1>
      <p className="secondaryText">Clinic&apos;s Invoice Timeline</p>
      <h1 className="text-xl mt-6">
        Grand Total:{" "}
        {getMoney(data.map((d) => d.ammount).reduce((a, b) => a + b))}
      </h1>
      <Timeline className="mt-6" color="dark">
        {data.map((d) => (
          <Timeline.Item
            key={d.invoiceId}
            title={format(d.timeStamp, "dd/MM/yy - EEE")}
            bullet={<CurrencyRupeeIcon />}
          >
            <p className="text-sm text-secondary mb-2 flex items-center gap-x-0.5">
              <Link href={`/patients/${d.patient.id}`}>
                <p className="hover:underline cursor-pointer capitalize">
                  {d.patient.name}
                </p>
              </Link>
              -<span>{getMoney(d.ammount)}</span>
            </p>
            <Link href={`/invoices/${d.invoiceId}`}>
              <p className="text-xs hover:underline cursor-pointer">
                View Invoice
              </p>
            </Link>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default ClinicInvoiceTimeline;
