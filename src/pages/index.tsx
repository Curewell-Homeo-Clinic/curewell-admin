import { Stats } from "@/components";
import { Loader } from "@/components/shared";
import { PatientsTable } from "@/components/Table";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next/types";

const Home: NextPage = () => {
  const { isLoading: isStatsLoading, data: overallStats } = trpc.useQuery([
    "get_overall_stats",
  ]);

  if (isStatsLoading) return <Loader />;

  return (
    <div>
      {overallStats && <Stats overallStats={overallStats} />}
      <PatientsTable />
    </div>
  );
};

export default Home;
