import { STATES } from "@/store";
import { InferQueryOutput } from "@/utils/trpc";
import { useRecoilValue } from "recoil";
import PatientFormCaseStudy from "./PatientCaseStudyForm";
import { PatientFormDetails } from "./PatientDetailsForm";
import PatientImages from "./PatientImages";
import PatientPlanForm from "./PatientPlanForm";
import PatientStatusTimeline from "./PatientStatusTimeline";

interface PatientFormProps {
  patient: InferQueryOutput<"get_patient_by_id">;
  allPlans: InferQueryOutput<"get_all_treatment_plans">;
}

export default function PatientForm({ patient, allPlans }: PatientFormProps) {
  const isAdmin = useRecoilValue(STATES.isAdmin);

  if (!patient || !allPlans) return null;

  const timeLineData = patient?.appointments
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
      {isAdmin && (
        <div className="flex flex-col gap-6" style={{ flex: 0.5 }}>
          <PatientFormCaseStudy
            id={patient.id}
            caseStudy={patient.caseStudy}
            prescription={patient.prescription}
          />
          {timeLineData.length > 0 && (
            <PatientStatusTimeline data={timeLineData} />
          )}
          <PatientImages patient={patient} />
        </div>
      )}
    </div>
  );
}
