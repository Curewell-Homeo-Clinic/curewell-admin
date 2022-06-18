import { InferQueryOutput } from "@/utils/trpc";
import { ChevronDoubleRightIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { format } from "date-fns";

const AppointmentsTable: React.FC<{
  appointments: InferQueryOutput<"get_all_appointments">;
}> = ({ appointments }) => {
  const router = useRouter();

  const handleViewDetail = (
    id: string,
    entity: "appointments" | "patients"
  ) => {
    router.push(`/${entity}/${id}`);
  };

  if (!appointments) return null;

  const tds = appointments.map((appointment, index) => (
    <tr key={appointment.id}>
      <td className="select-none">{index + 1}</td>
      <td
        className="capitalize cursor-pointer hover:underline"
        onClick={() => handleViewDetail(appointment.patient.id, "patients")}
      >
        {`${appointment.patient.firstName} ${appointment.patient.lastName}`}
      </td>
      <td className="capitalize cursor-pointer hover:underline">
        {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
      </td>
      <td>{format(new Date(appointment.timeStamp), "dd/MM/yy")}</td>
      <td>
        <input
          type="checkbox"
          checked={appointment.visited}
          value=""
          className="ml-2 w-4 h-4 text-secondary bg-gray-100 rounded border-gray-300 focus:ring-2 focus:ring-primaryLight"
        />
      </td>
      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button
          type="button"
          onClick={() => handleViewDetail(appointment.id, "appointments")}
          className="text-primary border  hover:bg-primary hover:text-white focus:ring-4 focus:outline-none focus:ring-primaryLight font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center mr-2 transition-all duration-300"
        >
          <ChevronDoubleRightIcon className="w-5" />
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="p-2 mt-8">
      <div className="inline-block min-w-full py-2 align-middle">
        <div className="overflow-hidden shadow ring-1 ring-primary ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-primary">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  Patient
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  Doctor
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  Date and Time
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  Visited
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 bg-white">{tds}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTable;
