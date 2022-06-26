import { Loader, Modal } from "@/components/shared";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { Select, SelectItem } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { z } from "zod";

const InvoiceCreateForm: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ show, setShow }) => {
  // data fetching
  const { isLoading: isPatientsLoading, data: patients } = trpc.useQuery([
    "get_all_patients",
  ]);
  const { isLoading: isDoctorsLoading, data: doctors } = trpc.useQuery([
    "get_all_doctors",
  ]);

  //   patient select states
  const [selectedPatient, setSelectedPatient] =
    useState<InferQueryOutput<"get_all_patients">[number]>();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  //   patient's plan select states
  const [isPlanSelectDisabled, setIsPlanSelectDisabled] =
    useState<boolean>(true);
  const [plansSelectData, setPlansSelectData] = useState<SelectItem[]>([]);
  const [selectedPatientPlanId, setSelectedPatientPlanId] =
    useState<string>("");

  // doctor select state
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  //   timestamp state
  const [timestamp, setTimestamp] = useState(new Date());

  // change the selected patient
  useEffect(() => {
    if (
      selectedPatientId !== "" &&
      z.string().cuid().parse(selectedPatientId)
    ) {
      setSelectedPatient(
        patients?.find((patient) => patient.id == selectedPatientId)
      );
    }
  }, [selectedPatientId]);

  // for the plan
  useEffect(() => {
    if (selectedPatient) {
      setPlansSelectData(
        selectedPatient.treatmentPlans.map((plan) => ({
          label: plan.plan.name,
          value: plan.id,
        }))
      );

      setIsPlanSelectDisabled(false);
    }
  }, [selectedPatient]);

  if (isPatientsLoading || !patients || isDoctorsLoading || !doctors)
    return <Loader />;

  return (
    <Modal show={show} setShow={setShow} title="Create Invoice">
      {/* Patient */}
      <div className="my-6">
        <Select
          label="Patient"
          description="Pick up a patient to create invoice for."
          searchable
          nothingFound="Oops! no patient found."
          placeholder="Pick a patient"
          data={patients.map((patient) => ({
            value: patient.id,
            label: `${patient.firstName} ${patient.lastName}`,
          }))}
          value={selectedPatientId}
          onChange={(val) => val && setSelectedPatientId(val)}
          required
        />
      </div>

      {/* Patient's Treatment Plan */}
      <div className="mb-6">
        <Select
          label="Patient's Treatment Plan"
          description="Pick a Treatment Plan attached with the selected Patient"
          placeholder="Pick a plan"
          disabled={isPlanSelectDisabled}
          data={plansSelectData}
          value={selectedPatientPlanId}
          onChange={(val) => val && setSelectedPatientPlanId(val)}
          required
        />
      </div>

      {/* doctor */}
      <div className="mb-6">
        <Select
          label="Doctor"
          description="Doctor incharge of the patient"
          placeholder="Pick the doctor"
          data={doctors.map((doctor) => ({
            label: `${doctor.firstName} ${doctor.lastName}`,
            value: doctor.id,
          }))}
          value={selectedDoctorId}
          onChange={(val) => val && setSelectedDoctorId(val)}
          required
        />
      </div>

      {/* Timestamp */}
      <div className="mb-6 flex gap-x-4">
        <DatePicker
          label="Date"
          placeholder="Pick a date"
          value={timestamp}
          onChange={(date) =>
            date &&
            setTimestamp((oldDate) => new Date(oldDate.setDate(date.getDate())))
          }
        />
        <TimeInput
          label="Time"
          placeholder="Pick a time"
          value={timestamp}
          onChange={(time) =>
            setTimestamp((oldTime) => new Date(oldTime.setTime(time.getTime())))
          }
        />
      </div>
    </Modal>
  );
};

export default InvoiceCreateForm;
