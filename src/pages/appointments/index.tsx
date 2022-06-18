import { Loader } from "@/components/shared";
import { AppointmentsTable } from "@/components/Table";
import { trpc } from "@/utils/trpc";

export default function AppointmentsPage() {
  const { isLoading, data: appointments } = trpc.useQuery([
    "get_all_appointments",
    {},
  ]);

  if (isLoading || !appointments) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Appointments</h1>
      </div>
      <AppointmentsTable appointments={appointments} />
    </div>
  );
}
