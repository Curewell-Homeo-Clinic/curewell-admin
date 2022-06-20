import { FormOptions } from "@/components/shared";
import { InferQueryOutput } from "@/utils/trpc";
import {
  CalendarIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AppointmentsForm: React.FC<{
  appointment: InferQueryOutput<"get_appointment_by_id">;
}> = ({ appointment }) => {
  const router = useRouter();
  const patientDetailsUrl = `/patients/${appointment?.patient.id}`;

  const [visited, setVisited] = useState<boolean>(appointment?.visited!);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleViewPatient = () => {
    router.push(patientDetailsUrl);
  };

  const handleReset = () => {
    setVisited(appointment?.visited!);
    setIsEdit(false);
  };

  const handleSave = async () => {
    setIsEdit(false);
  };

  useEffect(() => {
    if (appointment?.visited !== visited) setIsEdit(true);
  }, [visited, appointment?.visited]);

  useEffect(() => {
    router.prefetch(patientDetailsUrl);
  }, []);

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
        <label htmlFor="dateAndTime" className="block mb-2 text-sm font-medium">
          Date and Time
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <CalendarIcon className="w-5" />
          </div>
          <input
            type="tel"
            id="dateAndTime"
            className="cursor-pointer bg-gray-50 capitalize  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
            placeholder="9090230423"
            maxLength={10}
            disabled
            value={`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-x-4">
          <div className="text-sm">
            <label htmlFor="visited" className="font-medium">
              Visited
            </label>
            <p className="text-xs font-normal text-secondary">
              Did the patient attended the appointment or not?
            </p>
          </div>
          <div className="flex items-center h-5">
            <input
              id="visited"
              aria-describedby="visited-description"
              type="checkbox"
              checked={visited}
              onChange={() => setVisited(!visited)}
              value=""
              className="w-4 h-4 text-primary bg-gray-100 rounded border-gray-300 focus:ring-primaryLight"
            />
          </div>
        </div>
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
