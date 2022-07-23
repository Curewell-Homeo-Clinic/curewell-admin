import { appRouter, createContext } from "@/backend/router";
import { Loader } from "@/components/shared";
import { ClinicsTable } from "@/components/Table";
import { trpc } from "@/utils/trpc";
import { createSSGHelpers } from "@trpc/react/ssg";
import { InferGetServerSidePropsType } from "next";
import superjson from "superjson";

export async function getServerSideProps() {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  ssg.fetchQuery("clinic.getAll");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}

export default function ClinicsPage(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { isLoading, data: clinics } = trpc.useQuery(["clinic.getAll"]);

  if (isLoading || !clinics) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <h1>Clinics</h1>
      </div>
      <ClinicsTable clinics={clinics} />
    </div>
  );
}
