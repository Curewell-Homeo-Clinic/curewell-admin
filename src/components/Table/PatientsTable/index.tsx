import { useRouter } from "next/router";
import { useState } from "react";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  admittedAt: Date;
  phone: string;
  ailments: { name: string }[];
};

interface PatientsTableProps {
  patients: Patient[];
}

export default function PatientsTable({
  patients: originalPatients,
}: PatientsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>(originalPatients);
  const [noSearchResult, setNoSearchResult] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNoSearchResult(false);

    if (search !== "") {
      const result = originalPatients.filter(
        (patient) =>
          patient.firstName.includes(search) ||
          patient.lastName.includes(search)
      );
      result.length === 0 && setNoSearchResult(true);
      setPatients(result);
    } else setPatients(originalPatients);
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
      <td className="">{`+91-${patient.phone}`}</td>
      <td>{patient.ailments.map((ailment) => ailment.name).join(", ")}</td>
      <td>{new Date(patient.admittedAt).toLocaleDateString()}</td>
      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button className="btn" onClick={() => handleViewPatient(patient.id)}>
          View
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="p-2 mt-8">
      <div className="inline-block min-w-full py-2 align-middle">
        <div className="mb-6 flex items-center justify-end px-4">
          <form onSubmit={(e) => handleSearch(e)}>
            <input
              type="text"
              className={`mr-2 border-2 ${
                noSearchResult ? "border-red-600" : "border-primary"
              } rounded-lg text-sm p-2 font-medium focus-visible:outline-0 focus-visible:outline-none`}
              placeholder="First Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn">
              Search
            </button>
          </form>
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
