import { Stats } from "@/components";
import { PatientsTable } from "@/components/Table";
import type { NextPage } from "next/types";

const Home: NextPage = () => {
  return (
    <div>
      <Stats />
      <PatientsTable />
    </div>
  );
};

export default Home;
