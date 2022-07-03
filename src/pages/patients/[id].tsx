import { Loader, Suspense } from "@/components/shared";
import { GoBackButton } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const PatientDeleteForm = dynamic(
  () => import("@/components/Form/PatientForm/PatientDeleteForm"),
  {
    suspense: true,
  }
);

const PatientForm = dynamic(() => import("@/components/Form/PatientForm"), {
  suspense: true,
});

export default function PatientPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, data: patient } = trpc.useQuery([
    "get_patient_by_id",
    { id: id! as string },
  ]);

  const { isLoading: isPlansLoading, data: allPlans } = trpc.useQuery([
    "get_all_treatment_plans",
  ]);

  if (isLoading || !patient || isPlansLoading || !allPlans) return <Loader />;

  return (
    <div>
      <GoBackButton />
      <div className="mt-8 px-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="secondaryText">Patient</p>
            <h1>{`${patient.firstName} ${patient.lastName}`}</h1>
            <p className="secondaryText">
              Joined at {new Date(patient.admittedAt).toLocaleDateString()}
            </p>
          </div>
          <Suspense>
            <PatientDeleteForm id={id! as string} />
          </Suspense>
        </div>
        <Suspense>
          <PatientForm patient={patient} allPlans={allPlans} />
        </Suspense>
      </div>
    </div>
  );
}
