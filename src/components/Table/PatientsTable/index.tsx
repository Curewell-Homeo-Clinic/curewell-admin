import { trpc } from "@/utils/trpc";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { useState } from "react";

export default function PatientsTable() {
  const [search, setSearch] = useState("");
  const { isLoading, data: patients } = trpc.useQuery([
    "get_patients_limit_and_offset",
    { limit: 10, offset: 0 },
  ]);

  if (isLoading) return <div>Loading...</div>;

  const tds = patients!.map((patient, index) => (
    <tr key={patient.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6 select-none">
        {index + 1}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6 capitalize">
        {`${patient.firstName} ${patient.lastName}`}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6">
        {`+91-${patient.phone}`}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6">
        {patient.ailments.map((ailment) => ailment.name).join(", ")}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6">
        {new Date(patient.admittedAt).toLocaleDateString()}
      </td>
      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button className="bg-transparent hover:bg-gray-100 select-none text-[#081A51] font-semibold  py-2 px-4 border border-[#081A51] rounded-lg">
          View
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="p-2 mt-8">
      <div className="inline-block min-w-full py-2 align-middle">
        <div className="mb-6 flex items-center justify-end px-4">
          <input
            type="text"
            className="mr-2 border-2 border-[#081A51] rounded-lg text-sm p-2 font-medium"
            placeholder="First Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-transparent hover:bg-gray-100 select-none text-sm text-[#081A51] font-semibold  py-2 px-4 border border-[#081A51] rounded-lg">
            Search
          </button>
        </div>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-[#081A51]">
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
                  Name
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  Ailments
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  Joined At
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">{tds}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
