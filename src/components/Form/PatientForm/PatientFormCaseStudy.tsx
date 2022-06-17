// for case study of patient

import { useEffect, useState } from "react";

interface PatientFormCaseStudyProps {
  caseStudy: string;
  prescription: string;
}

export default function PatientFormCaseStudy({
  caseStudy,
  prescription,
}: PatientFormCaseStudyProps) {
  const [caseStudyValue, setCaseStudyValue] = useState(caseStudy);
  const [prescriptionValue, setPrescriptionValue] = useState(prescription);

  const [isEdit, setIsEdit] = useState(false);

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
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Prescription
        </label>
        <textarea
          id="prescription"
          rows={4}
          value={prescriptionValue}
          onChange={(e) => setPrescriptionValue(e.target.value)}
          className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary "
          placeholder="Patient's Prescription"
        ></textarea>
      </div>
      <div className="mb-6">
        <label
          htmlFor="caseStudy"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Case Study
        </label>
        <textarea
          id="caseStudy"
          rows={10}
          value={caseStudyValue}
          onChange={(e) => setCaseStudyValue(e.target.value)}
          className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary "
          placeholder="Patient's Case Study"
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
          disabled={isEdit ? false : true}
        >
          Save
        </button>
      </div>
    </form>
  );
}
