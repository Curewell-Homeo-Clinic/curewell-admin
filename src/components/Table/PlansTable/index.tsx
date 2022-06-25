import { PlanCreateForm } from "@/components/Form";
import { getMoney } from "@/utils";
import { InferQueryOutput } from "@/utils/trpc";
import { ChevronDoubleRightIcon, SearchIcon } from "@heroicons/react/outline";
import { daysToWeeks, formatDuration } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const PlansTable: React.FC<{
  plans: InferQueryOutput<"get_all_treatment_plans">;
}> = ({ plans: allPlans }) => {
  const [plans, setPlans] = useState(allPlans);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleViewPlan = (id: string) => {
    router.push(`/plans/${id}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search != "") {
      setPlans(
        allPlans.filter(
          (plan) =>
            plan.name.toLowerCase().includes(search) ||
            plan.duration.toString().includes(search)
        )
      );
    } else setPlans(allPlans);
  };

  const tds = plans.map((plan, index) => (
    <tr key={plan.id}>
      <td className="select-none">{index + 1}</td>
      <td className="capitalize">{plan.name}</td>
      <td>
        {formatDuration(
          { weeks: daysToWeeks(plan.duration), days: plan.duration % 7 },
          { format: ["weeks", "days"] }
        )}
      </td>
      <td>{getMoney(plan.price)}</td>
      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button
          type="button"
          onClick={() => handleViewPlan(plan.id)}
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
          <PlanCreateForm show={showCreateModal} setShow={setShowCreateModal} />
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
                  Duration
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                >
                  Price
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
};

export default PlansTable;
