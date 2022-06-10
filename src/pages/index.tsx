import { trpc } from "@/utils/trpc";
import type { NextPage } from "next/types";

const Home: NextPage = () => {
  const { data: patients, isLoading } = trpc.useQuery(["get_all_patients"]);

  if (isLoading) return <p>Loading...</p>;

  return <div className="bg-red-800 text-red-100 text-xl">{patients}</div>;
};

export default Home;
