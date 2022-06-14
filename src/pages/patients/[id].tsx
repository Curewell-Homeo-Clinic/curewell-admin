import { Loader } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function PatientPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, data: patient } = trpc.useQuery([
    "get_patient_by_id",
    { id: id! as string },
  ]);

  if (isLoading) return <Loader />;

  return <div>{JSON.stringify(patient)}</div>;
}
