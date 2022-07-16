import { GoBackButton, Loader, Suspense } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { AppointmentDeleteForm } from "@/components/Form";

const AppointmentForm = dynamic(
  () => import("@/components/Form/AppointmentsForm"),
  { suspense: true }
);

export default function AppointmentPage() {
  const router = useRouter();
  let { id } = router.query;
  id = id! as string;

  const { isLoading, data: appointment } = trpc.useQuery([
    "appointments.get",
    { id },
  ]);

  if (isLoading || !appointment) return <Loader />;

  return (
    <div>
      <GoBackButton />
      <div className="mt-8 px-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="secondaryText">Appointment</p>
            <div className="flex items-center gap-x-4">
              <h1>{`${appointment.patient.firstName}'s Appointment`}</h1>
              <span
                className={`${
                  appointment.visited ? "bg-green-100" : "bg-red-100"
                } ${
                  appointment.visited ? "text-green-600" : "text-red-600"
                } text-xs font-semibold px-2.5 py-0.5 rounded select-none cursor-pointer`}
              >
                {appointment.visited ? "Visited" : "Not Visited"}
              </span>
            </div>
            <p className="secondaryText">
              On {format(new Date(appointment.timeStamp), "dd/MM/yy hh:mm aaa")}
            </p>
          </div>
          <AppointmentDeleteForm id={appointment.id} />
        </div>
        <Suspense>
          <AppointmentForm appointment={appointment} />
        </Suspense>
      </div>
    </div>
  );
}
