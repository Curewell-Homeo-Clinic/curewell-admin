import { getMoney } from "@/utils";
import { InferQueryOutput } from "@/utils/trpc";
import { TrashIcon } from "@heroicons/react/outline";
import { PatientTreatmentPlan, TreatmentPlan } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddPlanForm from "./AddPlanForm";
import PatientPlanRemoveForm from "./PatientPlanRemoveForm";

const PatientPlanForm: React.FC<{
  plans: PatientTreatmentPlan[];
  allPlans: InferQueryOutput<"get_all_treatment_plans">;
  patientId: string;
}> = ({ plans, allPlans, patientId }) => {
  const router = useRouter();

  const [optedPlans, setOptedPlans] = useState<TreatmentPlan[]>([]);
  const [notOptedPlans, setNotOptedPlans] = useState<TreatmentPlan[]>([]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);

  const isDeleteDisabled = (plan: TreatmentPlan) => {
    return (plans.find((patientPlan) => patientPlan.planId === plan.id)
      ?.ammountPaid || 0) === 0
      ? false
      : true;
  };

  const handleViewPlan = (id: string) => {
    router.push(`/plans/${id}`);
  };

  useEffect(() => {
    const optedPlansIds = plans.map((plan) => plan.planId);
    if (allPlans) {
      setOptedPlans(
        allPlans
          .filter((plan) => optedPlansIds.includes(plan.id))
          ?.map((plan) => plan as TreatmentPlan)!
      );
      setNotOptedPlans(
        allPlans
          .filter((plan) => !optedPlansIds.includes(plan.id))
          ?.map((plan) => plan as TreatmentPlan)!
      );
    }
  }, [allPlans, plans]);

  if (!allPlans) return null;

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1>Treatment Plan Details</h1>
          <p className="secondaryText">Patient&apos;s Treatment Plan Details</p>
        </div>
        <button className="btn" onClick={() => setShowAddModal(true)}>
          Add
        </button>
        <AddPlanForm
          show={showAddModal}
          setShow={setShowAddModal}
          notOptedPlans={notOptedPlans}
          patientId={patientId}
        />
      </div>

      <div className="my-6">
        <div className="inline-block min-w-full align-middle">
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
                    Paid
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white select-none sm:pl-6"
                  >
                    Due
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
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {optedPlans.map((plan, index) => (
                  <tr key={plan.id}>
                    <td className="select-none">{index + 1}</td>
                    <td
                      className="capitalize cursor-pointer hover:underline"
                      onClick={() => handleViewPlan(plan.id)}
                    >
                      {plan.name}
                    </td>
                    <td>
                      {getMoney(
                        plans.find(
                          (patientPlan) => patientPlan.planId === plan.id
                        )?.ammountPaid || 0
                      )}
                    </td>
                    <td>
                      {getMoney(
                        plan.price -
                          (plans.find(
                            (patientPlan) => patientPlan.planId === plan.id
                          )?.ammountPaid || 0)
                      )}
                    </td>
                    <td>{getMoney(plan.price)}</td>
                    <td>
                      <button
                        onClick={() => setShowDeleteConfirmation(true)}
                        disabled={isDeleteDisabled(plan)}
                        className="hover:bg-red-50 text-secondary hover:text-red-600 disabled:hover:text-primaryLight disabled:cursor-not-allowed select-none focus:ring-2 focus:ring-red-100 rounded p-1 duration-300"
                      >
                        <TrashIcon className="w-5" />
                      </button>
                    </td>
                    <PatientPlanRemoveForm
                      showDeleteConfirmation={showDeleteConfirmation}
                      setShowDeleteConfirmation={setShowDeleteConfirmation}
                      patientId={patientId}
                      patientPlanId={
                        plans.find(
                          (patientPlan) => patientPlan.planId === plan.id
                        )?.id!
                      }
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PatientPlanForm;
