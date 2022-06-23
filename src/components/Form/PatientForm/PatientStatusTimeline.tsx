import { CalendarIcon } from "@heroicons/react/outline";
import { Timeline } from "@mantine/core";
import { format } from "date-fns";
import Link from "next/link";

const PatientStatusTimeline: React.FC<{
  data: {
    appointmentId: string;
    timeStamp: Date;
    status: string;
  }[];
}> = ({ data }) => {
  return (
    <div className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center">
      <Timeline color="dark" active={0}>
        {data.map((d) => (
          <Timeline.Item
            key={d.appointmentId}
            title={format(d.timeStamp, "dd/MM/yy - EEE")}
            bullet={<CalendarIcon className="w-3" />}
          >
            <p className="text-sm text-secondary mb-2">{d.status}</p>
            <Link href={`/appointments/${d.appointmentId}`}>
              <p className="text-xs hover:underline cursor-pointer">
                View Appointment
              </p>
            </Link>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default PatientStatusTimeline;
