import { InferQueryOutput } from "@/utils/trpc";

const AppointmentsForm: React.FC<{
  appointment: InferQueryOutput<"get_appointment_by_id">;
}> = ({ appointment }) => {
  if (!appointment) return null;

  return <div className="flex mt-6">{appointment.id}</div>;
};

export default AppointmentsForm;
