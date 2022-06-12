import { DotsVerticalIcon } from "@heroicons/react/outline";
import { useState } from "react";

export default function PatientsTable() {
  const [patients] = useState([
    {
      name: "John Doe",
      phoneNumber: "123456789",
      joined: "2020-01-01",
      ailments: ["Fever", "Cough"],
    },
    {
      name: "John Doe",
      phoneNumber: "123456789",
      joined: "2020-01-01",
      ailments: ["Fever", "Cough"],
    },
    {
      name: "John Doe",
      phoneNumber: "123456789",
      joined: "2020-01-01",
      ailments: ["Fever", "Cough"],
    },
    {
      name: "John Doe",
      phoneNumber: "123456789",
      joined: "2020-01-01",
      ailments: ["Fever", "Cough"],
    },
    {
      name: "John Doe",
      phoneNumber: "123456789",
      joined: "2020-01-01",
      ailments: ["Fever", "Cough"],
    },
  ]);

  const tds = patients.map((patient, index) => (
    <tr key={index}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6 select-none">
        {index}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6">
        {patient.name}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6">
        {patient.phoneNumber}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6">
        {patient.ailments.join(", ")}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-[#081A51] sm:pl-6">
        {patient.joined}
      </td>
      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button className="bg-transparent hover:bg-gray-100 select-none text-gray-800 font-semibold hover:text-gray-700 py-2 px-4 border border-gray-400 hover:border-gray-500 rounded-lg">
          View
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="p-2 mt-8">
      <div className="inline-block min-w-full py-2 align-middle">
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
