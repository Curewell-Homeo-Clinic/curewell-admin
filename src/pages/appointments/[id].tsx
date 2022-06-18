import { GoBackButton, Loader } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { AppointmentForm } from "@/components/Form";

export default function AppointmentPage() {
  const router = useRouter();
  let { id } = router.query;
  id = id! as string;

  const { isLoading, data: appointment } = trpc.useQuery([
    "get_appointment_by_id",
    { id },
  ]);

  if (isLoading || !appointment) return <Loader />;

  return (
    <div>
      <GoBackButton />
      <div className="mt-8 px-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-x-2">
            <p className="secondaryText">Appointment</p>
            <h1>{`${appointment.patient.firstName}'s Appointment`}</h1>
            <p className="secondaryText">
              On {format(new Date(appointment.timeStamp), "dd/MM/yy hh:mm aaa")}
            </p>
          </div>
        </div>
        <AppointmentForm appointment={appointment} />
      </div>
    </div>
  );
}
