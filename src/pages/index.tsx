import { Stats } from "@/components";
import { Loader } from "@/components/shared";
import { PatientsTable, AppointmentsTable } from "@/components/Table";
import { STATES } from "@/store";
import { trpc } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export default function Home() {
  const { isLoading: isStatsLoading, data: overallStats } = trpc.useQuery([
    "get_overall_stats",
  ]);

  const { isLoading: isPatientsLoading, data: patients } = trpc.useQuery([
    "get_all_patients",
    { limit: 10 },
  ]);

  const { isLoading: isAppointmentsLoading, data: appointments } =
    trpc.useQuery(["get_all_appointments", { limit: 10 }]);

  const isAdmin = useRecoilValue(STATES.isAdmin);

  if (
    isStatsLoading ||
    !overallStats ||
    isPatientsLoading ||
    !patients ||
    isAppointmentsLoading ||
    !appointments
  )
    return <Loader />;

  return (
    <div>
      {isAdmin && <Stats overallStats={overallStats} />}
      <div className="flex flex-wrap gap-10 w-full items-start mt-10">
        <div style={{ flex: 0.5 }}>
          <h1 className="px-2">Patients</h1>
          <PatientsTable patients={patients} />
        </div>

        <div style={{ flex: 0.5 }}>
          <h1 className="px-2">Appointments</h1>
          <AppointmentsTable appointments={appointments} />
        </div>
      </div>
    </div>
  );
}
