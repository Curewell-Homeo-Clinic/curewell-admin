import { PatientForm } from "@/components/Form";
import { Loader } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { ChevronDoubleLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PatientPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, data: patient } = trpc.useQuery([
    "get_patient_by_id",
    { id: id! as string },
  ]);

  if (isLoading || !patient) return <Loader />;

  return (
    <div>
      <div className="p-2">
        <button className="btn flex items-center" onClick={() => router.back()}>
          <ChevronDoubleLeftIcon className="w-5 mr-1" />
          <span>Go Back</span>
        </button>
      </div>
      <div className="mt-8 px-2">
        <div className="flex flex-col gap-x-2">
          <p className="secondaryText">Patient</p>
          <h1>{`${patient.firstName} ${patient.lastName}`}</h1>
          <p className="secondaryText">
            Joined at {new Date(patient.admittedAt).toLocaleDateString()}
          </p>
        </div>
        <PatientForm patient={patient} />
      </div>
    </div>
  );
}
