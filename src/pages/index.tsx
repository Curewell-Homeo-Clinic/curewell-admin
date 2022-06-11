import { trpc } from "@/utils/trpc";
import type { NextPage } from "next/types";

const Home: NextPage = () => {
  const { isLoading, data: patients } = trpc.useQuery(["get_all_patients"]);
  if (isLoading) return <div>Loading...</div>;
  if (patients)
    return (
      <div className="bg-red-800 text-red-100 text-xl">
        {patients.map((patient) => (
          <div key={patient.id}>{patient.firstName}</div>
        ))}
      </div>
    );

  return null;
};

export default Home;
