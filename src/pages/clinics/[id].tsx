import { GetServerSidePropsContext } from "next";
import { trpc } from "@/utils/trpc";
import { createSSGHelpers } from "@trpc/react/ssg";
import { InferGetServerSidePropsType } from "next";
import superjson from "superjson";
import { appRouter, createContext } from "@/backend/router";
import { GoBackButton, Loader } from "@/components/shared";
import { ClinicDeleteForm, ClinicForm } from "@/components/Form";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const { id } = context.params!;

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  ssg.fetchQuery("clinic.get", { id });
  ssg.fetchQuery("clinic.getGT", { id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default function ClinicPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { id } = props;
  const { isLoading, data: clinic } = trpc.useQuery(["clinic.get", { id }]);
  const { isLoading: isGTLoading, data: gt } = trpc.useQuery([
    "clinic.getGT",
    { id },
  ]);
  if (isLoading || !clinic || isGTLoading || !gt) return <Loader />;

  return (
    <div>
      <GoBackButton route="/clinics" />
      <div className="mt-8 px-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="secondaryText">Clinic Number: {clinic.number}</p>
            <h1>{clinic.name}</h1>
          </div>
          {clinic.invoices.length <= 0 && <ClinicDeleteForm id={clinic.id} />}
        </div>
        <ClinicForm clinic={clinic} gt={gt} />
      </div>
    </div>
  );
}
