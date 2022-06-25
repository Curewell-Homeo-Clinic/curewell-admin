import { PatientDeleteForm, PatientForm } from "@/components/Form";
import { Loader } from "@/components/shared";
import { GoBackButton } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

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
          <PatientDeleteForm id={id! as string} />
        </div>
        <PatientForm patient={patient} allPlans={allPlans} />
      </div>
    </div>
  );
}
