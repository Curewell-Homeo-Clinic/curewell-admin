import { Loader, Suspense } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import dynamic from "next/dynamic";

const AppointmentsTable = dynamic(
  () => import("@/components/Table/AppointmentsTable"),
  {
    suspense: true,
  }
);

export default function AppointmentsPage() {
  const { isLoading, data: appointments } = trpc.useQuery([
    "appointments.getAll",
    {},
  ]);

  if (isLoading || !appointments) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Appointments</h1>
      </div>
      <Suspense>
        <AppointmentsTable appointments={appointments} />
      </Suspense>
    </div>
  );
}
