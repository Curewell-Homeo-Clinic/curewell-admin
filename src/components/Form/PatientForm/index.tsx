import { InferQueryOutput } from "@/utils/trpc";
import PatientFormCaseStudy from "./PatientFormCaseStudy";
import { PatientFormDetails } from "./PatientFormDetails";

interface PatientFormProps {
  patient: InferQueryOutput<"get_patient_by_id">;
}

export default function PatientForm({ patient }: PatientFormProps) {
  if (!patient) return null;

  return (
    <div className="flex flex-wrap md:sm:flex-col lg:flex-row gap-10 lg:items-start md:sm:items-stretch justify-between mt-6">
      <PatientFormDetails patient={patient} />
      <PatientFormCaseStudy
        id={patient.id}
        caseStudy={patient.caseStudy}
        prescription={patient.prescription}
      />
    </div>
  );
}
