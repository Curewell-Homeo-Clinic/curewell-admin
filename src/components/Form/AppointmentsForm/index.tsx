import { FormOptions } from "@/components/shared";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import {
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { Checkbox } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AppointmentsForm: React.FC<{
  appointment: InferQueryOutput<"get_appointment_by_id">;
}> = ({ appointment }) => {
  const router = useRouter();
  const patientDetailsUrl = `/patients/${appointment?.patient.id}`;

  const [visited, setVisited] = useState<boolean>(appointment?.visited!);
  const [timeStamp] = useState<Date>(new Date(appointment?.timeStamp!));
  const [progress, setProgress] = useState<string>(appointment?.progress!);
  const [date, setDate] = useState<Date>(timeStamp);
  const [time, setTime] = useState<Date>(timeStamp);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const updateMutation = trpc.useMutation(["update_appointment"]);

  const handleViewPatient = () => {
    router.push(patientDetailsUrl);
  };

  const handleReset = () => {
    setVisited(appointment?.visited!);
    setDate(timeStamp);
    setTime(timeStamp);
    setProgress(appointment?.progress!);
    setIsEdit(false);
  };

  const handleSave = async () => {
    console.log(date, time);

    (await updateMutation.mutateAsync({
      date: date.toISOString(),
      time: time.toISOString(),
      id: appointment?.id!,
      visited: visited,
      progress,
    })) && router.reload();
  };

  useEffect(() => {
    if (
      appointment?.visited !== visited ||
      timeStamp !== date ||
      appointment.progress !== progress ||
      timeStamp !== time
    )
      setIsEdit(true);
    else setIsEdit(false);
  }, [
    visited,
    appointment?.visited,
    date,
    time,
    timeStamp,
    progress,
    appointment?.progress,
  ]);

  useEffect(() => {
    router.prefetch(patientDetailsUrl);
  });

  if (!appointment) return null;

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1>Appointment Details</h1>

      <div className="mt-6 mb-6" onClick={handleViewPatient}>
        <label htmlFor="patient" className="block mb-2 text-sm font-medium">
          Patient
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <UserIcon className="w-5" />
          </div>
          <input
            type="text"
            id="patient"
            className="cursor-pointer bg-gray-50 capitalize  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
            placeholder="9090230423"
            maxLength={10}
            disabled
            value={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="doctor" className="block mb-2 text-sm font-medium">
          Doctor
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <UserCircleIcon className="w-5" />
          </div>
          <input
            type="text"
            id="doctor"
            className="cursor-pointer bg-gray-50 capitalize  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
            placeholder="9090230423"
            maxLength={10}
            disabled
            value={`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="progress" className="block mb-2 text-sm font-medium">
          Patient&apos;s Progress
        </label>
        <input
          type="text"
          id="progress"
          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
          placeholder="reshu"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-x-10">
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
      </div>

      <div className="mb-6">
        <Checkbox
          label="Visited"
          checked={visited}
          onChange={() => setVisited(!visited)}
        />
      </div>

      <FormOptions
        handleReset={handleReset}
        handleSave={handleSave}
        isEdit={isEdit}
      />
    </form>
  );
};

export default AppointmentsForm;
