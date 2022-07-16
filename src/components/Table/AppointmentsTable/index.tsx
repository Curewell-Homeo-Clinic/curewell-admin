import { InferQueryOutput } from "@/utils/trpc";
import { ChevronDoubleRightIcon, SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { useState } from "react";
import { AppointmentCreateForm } from "@/components/Form";

const AppointmentsTable: React.FC<{
  appointments: InferQueryOutput<"appointments.getAll">;
}> = ({ appointments: allAppointments }) => {
  const router = useRouter();

  const [appointments, setAppointments] = useState(allAppointments);
  const [search, setSearch] = useState<string>("");

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search !== "") {
      const result = allAppointments.filter(
        (appointments) =>
          appointments.patient.firstName.includes(search) ||
          appointments.patient.lastName.includes(search)
      );
      setAppointments(result);
    } else setAppointments(allAppointments);
  };

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
      <td className="capitalize">
        {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
      </td>
      <td>{format(new Date(appointment.timeStamp), "dd/MM/yy - EEE")}</td>
      <td>{format(new Date(appointment.timeStamp), "hh:mm aaa")}</td>
      <td>
        <span
          className={`${appointment.visited ? "bg-green-100" : "bg-red-100"} ${
            appointment.visited ? "text-green-600" : "text-red-600"
          } text-xs font-semibold px-2.5 py-0.5 rounded select-none cursor-pointer`}
        >
          {appointment.visited ? "Visited" : "Not Visited"}
        </span>
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
        <div className="mb-6 flex justify-between items-center">
          <form className="flex items-center" onSubmit={(e) => handleSearch(e)}>
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-secondary" />
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                placeholder="Search"
                spellCheck={false}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="sr-only" type="submit" />
            </div>
          </form>
          <button className="btn" onClick={() => setShowCreateModal(true)}>
            Add
          </button>
          <AppointmentCreateForm
            show={showCreateModal}
            setShow={setShowCreateModal}
          />
        </div>
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
                  Date
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  Time
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
