import { Loader, Suspense } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import dynamic from "next/dynamic";

const PatientsTable = dynamic(
  () => import("@/components/Table/PatientsTable"),
  {
    suspense: true,
  }
);

export default function Patients() {
  const { isLoading, data: patients } = trpc.useQuery(["get_all_patients"]);

  if (isLoading || !patients) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Patients</h1>
      </div>
      <Suspense>
        <PatientsTable patients={patients} />
      </Suspense>
    </div>
  );
}
