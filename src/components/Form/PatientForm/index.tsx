import { InferQueryOutput } from "@/utils/trpc";
import PatientFormCaseStudy from "./PatientCaseStudyForm";
import { PatientFormDetails } from "./PatientDetailsForm";
import PatientPlanForm from "./PatientPlanForm";
import PatientStatusTimeline from "./PatientStatusTimeline";

interface PatientFormProps {
  patient: InferQueryOutput<"get_patient_by_id">;
  allPlans: InferQueryOutput<"get_all_treatment_plans">;
}

export default function PatientForm({ patient, allPlans }: PatientFormProps) {
  if (!patient || !allPlans) return null;

  const timeLineData = patient.appointments
    .filter((appointment) => appointment.visited)
    .map((appointment) => ({
      appointmentId: appointment.id,
      timeStamp: new Date(appointment.timeStamp),
      status: appointment.progress,
    }));

  return (
    <div className="flex flex-wrap md:sm:flex-col lg:flex-row gap-10 lg:items-start md:sm:items-stretch mt-6">
      <div className="flex flex-col gap-6" style={{ flex: 0.5 }}>
        <PatientPlanForm
          plans={patient.treatmentPlans}
          allPlans={allPlans}
          patientId={patient.id}
        />
        <PatientFormDetails patient={patient} />
      </div>
      <div className="flex flex-col gap-6" style={{ flex: 0.5 }}>
        <PatientStatusTimeline data={timeLineData} />
        <PatientFormCaseStudy
          id={patient.id}
          caseStudy={patient.caseStudy}
          prescription={patient.prescription}
        />
      </div>
    </div>
  );
}
