import { trpc } from "@/utils/trpc";
import type { NextPage } from "next/types";

const Home: NextPage = () => {
  const { isLoading, data: world } = trpc.useQuery(["hello"]);
  const { data: patients } = trpc.useQuery(["get_all_patients"]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-red-800 text-red-100 text-xl">
      {world} {patients}
    </div>
  );
};

export default Home;
