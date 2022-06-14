import { Stats } from "@/components";
import { Loader } from "@/components/shared";
import { PatientsTable } from "@/components/Table";
import { trpc } from "@/utils/trpc";

export default function Home() {
  const { isLoading: isStatsLoading, data: overallStats } = trpc.useQuery([
    "get_overall_stats",
  ]);

  const { isLoading: isPatientsLoading, data: patients } = trpc.useQuery([
    "get_patients_limit_and_offset",
    { limit: 10 },
  ]);

  if (isStatsLoading || !overallStats || isPatientsLoading || !patients)
    return <Loader />;

  return (
    <div>
      <Stats overallStats={overallStats} />
      <PatientsTable patients={patients} />
    </div>
  );
}
