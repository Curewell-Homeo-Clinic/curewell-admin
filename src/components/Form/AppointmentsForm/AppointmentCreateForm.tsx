import { CalendarIcon, ClockIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Checkbox, Select } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { Loader, Modal } from "@/components/shared";
import { capitalizeFirst } from "@/utils";
import { z } from "zod";

const AppointmentCreateForm: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ show, setShow }) => {
  const [patientId, setPatientId] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [visited, setVisited] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  // getting all patients
  const { isLoading: isPatientLoading, data: allPatients } = trpc.useQuery([
    "get_all_patients",
  ]);

  const patientsSelectData = allPatients?.map((patient) => ({
    value: patient.id,
    label: capitalizeFirst(`${patient.firstName} ${patient.lastName}`),
  }))!;

  // getting all doctors
  const { isLoading: isDoctorLoading, data: allDoctors } = trpc.useQuery([
    "get_all_doctors",
  ]);

  const doctorsSelectData = allDoctors?.map((doctor) => ({
    value: doctor.id,
    label: capitalizeFirst(`${doctor.firstName} ${doctor.lastName}`),
  }))!;

  const createAppointmentMutation = trpc.useMutation(["create_appointment"]);

  const router = useRouter();

  const handleSave = async () => {
    if (
      z.string().cuid().parse(patientId) &&
      z.string().cuid().parse(doctorId)
    ) {
      (await createAppointmentMutation.mutateAsync({
        patientId,
        doctorId,
        date: date.toISOString(),
        time: time.toISOString(),
        visited,
      })) && router.reload();
    } else router.reload();
  };

  useEffect(() => {
    visited || (patientId !== "" && doctorId !== "")
      ? setIsEdit(true)
      : setIsEdit(false);
  }, [visited, patientId, doctorId]);

  if (isPatientLoading || !allPatients || isDoctorLoading || !allDoctors) {
    return (
      <Modal show={show} setShow={setShow} title="add new appointment">
        <Loader />
      </Modal>
    );
  }

  return (
    <Modal show={show} setShow={setShow} title="add new appointment">
      <form className="mt-4 min-w-full" onSubmit={(e) => e.preventDefault()}>
        <div className="mt-6 mb-6">
          <Select
            label="Patient"
            placeholder="Select a patient"
            searchable
            maxDropdownHeight={280}
            nothingFound="No patients found"
            data={patientsSelectData}
            value={patientId}
            onChange={(e) => setPatientId(e!)}
          />
        </div>

        <div className="mt-6 mb-6">
          <Select
            label="Doctor"
            placeholder="Select a doctor"
            searchable
            maxDropdownHeight={280}
            nothingFound="No doctors found"
            data={doctorsSelectData}
            value={doctorId}
            onChange={(e) => setDoctorId(e!)}
          />
        </div>

        <div className="mb-6 flex items-center gap-x-10">
          <DatePicker
            placeholder="Pick a date"
            label="Appointment's Date"
            radius="md"
            variant="filled"
            styles={{
              label: { fontWeight: "inherit" },
            }}
            value={date}
            onChange={(date) => date && setDate(date)}
            icon={<CalendarIcon className="w-5" />}
          />

          <TimeInput
            placeholder="Pick a time"
            label="Appointments's Time"
            variant="filled"
            radius="md"
            format="12"
            clearable
            styles={{
              label: { fontWeight: "inherit" },
            }}
            value={time}
            onChange={(time) => time && setTime(time)}
            icon={<ClockIcon className="w-5" />}
          />
        </div>

        <div className="mb-6">
          <Checkbox
            label="Visited"
            checked={visited}
            onChange={() => setVisited(!visited)}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
            disabled={isEdit ? false : true}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentCreateForm;
