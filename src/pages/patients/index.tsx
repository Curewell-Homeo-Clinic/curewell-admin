import { Loader } from "@/components/shared";
import { PatientsTable } from "@/components/Table";
import { trpc } from "@/utils/trpc";

export default function Patients() {
  const { isLoading, data: patients } = trpc.useQuery(["get_all_patients"]);

  if (isLoading || !patients) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Patients</h1>
      </div>
      <PatientsTable patients={patients} />
    </div>
  );
}
