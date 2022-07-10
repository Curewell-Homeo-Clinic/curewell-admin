import { InferQueryOutput } from "@/utils/trpc";
import ImageCard from "./ImageCard";
import PatientImageUploader from "./ImageUploader";

const PatientImageForm: React.FC<{
  patient: InferQueryOutput<"get_patient_by_id">;
}> = ({ patient }) => {
  if (!patient) return null;

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1>Patient&apos;s Images</h1>
      <p className="secondaryText">
        Patient&apos;s Images: Before/After Images and Test Reports
      </p>

      <PatientImageUploader patient={patient} />

      {/* Images GRIDS */}

      {/* test reports */}
      <div className="flex flex-col gap-2 mb-6">
        <p className="secondaryText">Test Reports</p>
        <div className="flex flex-wrap gap-4">
          {patient.testReportsImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              category="report"
              patientId={patient.id}
            />
          ))}
        </div>
      </div>

      <div className="flex items-stretch justify-between gap-2 mb-6">
        {/* Before Treatment Images */}
        <div className="flex flex-col gap-2">
          <p className="secondaryText">Before Treatment</p>
          <div className="flex flex-wrap gap-4">
            {patient.beforeTreatmentImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                category="before"
                patientId={patient.id}
              />
            ))}
          </div>
        </div>

        {/* after treatment images */}
        <div className="flex flex-col gap-2">
          <p className="secondaryText">After Treatment</p>
          <div className="flex flex-wrap gap-4">
            {patient.afterTreatmentImages.map((image) => (
              <ImageCard
                image={image}
                key={image.id}
                category="after"
                patientId={patient.id}
              />
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default PatientImageForm;
