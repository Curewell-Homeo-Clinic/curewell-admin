// for case study of patient

import { FormOptions } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface PatientFormCaseStudyProps {
  id: string;
  caseStudy: string;
  prescription: string;
}

export default function PatientFormCaseStudy({
  caseStudy,
  prescription,
  id,
}: PatientFormCaseStudyProps) {
  const [caseStudyValue, setCaseStudyValue] = useState(caseStudy);
  const [prescriptionValue, setPrescriptionValue] = useState(prescription);

  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();

  const updateMutation = trpc.useMutation([
    "patients.updateCaseStudyAndPrescription",
  ]);

  const handleReset = () => {
    setCaseStudyValue(caseStudy);
    setPrescriptionValue(prescription);
    setIsEdit(false);
  };

  const handleSave = async () => {
    (await updateMutation.mutateAsync({
      id,
      caseStudy: caseStudyValue,
      prescription: prescriptionValue,
    })) && router.reload();
  };

  useEffect(() => {
    if (caseStudyValue !== caseStudy || prescriptionValue !== prescription) {
      setIsEdit(true);
    } else setIsEdit(false);
  }, [caseStudy, caseStudyValue, prescription, prescriptionValue]);

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1>Case Study</h1>
      <p className="secondaryText">Patient&apos;s Case Study</p>

      <div className="mt-6 mb-6">
        <label
          htmlFor="prescription"
          className="block mb-2 text-sm font-medium"
        >
          Prescription
        </label>
        <textarea
          id="prescription"
          rows={4}
          spellCheck={false}
          value={prescriptionValue}
          onChange={(e) => setPrescriptionValue(e.target.value)}
          className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
          placeholder="Patient's Prescription"
        ></textarea>
      </div>
      <div className="mb-6">
        <label htmlFor="caseStudy" className="block mb-2 text-sm font-medium">
          Case Study
        </label>
        <textarea
          id="caseStudy"
          rows={10}
          spellCheck={false}
          value={caseStudyValue}
          onChange={(e) => setCaseStudyValue(e.target.value)}
          className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
          placeholder="Patient's Case Study"
        ></textarea>
      </div>
      <FormOptions
        isEdit={isEdit}
        handleReset={handleReset}
        handleSave={handleSave}
      />
    </form>
  );
}
