import { trpc } from "@/utils/trpc";
import type { NextPage } from "next/types";

const Home: NextPage = () => {
  const { isLoading, data: world } = trpc.useQuery(["hello"]);

  if (isLoading) return <p>Loading...</p>;

  return <div className="bg-red-800 text-red-100 text-xl">{world}</div>;
};

export default Home;
