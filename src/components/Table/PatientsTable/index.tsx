import { PatientCreateForm } from "@/components/Form";
import { InferQueryOutput } from "@/utils/trpc";
import { ChevronDoubleRightIcon, SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useState } from "react";

interface PatientsTableProps {
  patients: InferQueryOutput<"get_all_patients">;
}

export default function PatientsTable({
  patients: allPatients,
}: PatientsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState(allPatients);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search !== "") {
      const result = allPatients.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
          patient.phone.includes(search)
      );
      setPatients(result);
    } else setPatients(allPatients);
  };

  const handleViewPatient = (id: string) => {
    router.push(`/patients/${id}`);
  };

  const tds = patients!.map((patient, index) => (
    <tr key={patient.id}>
      <td className="select-none">{index + 1}</td>
      <td className="capitalize">
        {`${patient.firstName} ${patient.lastName}`}
      </td>
      <td>{`+91-${patient.phone}`}</td>
      <td>{patient.age}</td>
      <td>{patient.ailments === "" ? "-" : patient.ailments}</td>
      <td>{new Date(patient.admittedAt).toLocaleDateString()}</td>
      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button
          type="button"
          onClick={() => handleViewPatient(patient.id)}
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
          <PatientCreateForm
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
                  Age
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
