import { Loader, Modal } from "@/components/shared";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import {
  CalendarIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  TemplateIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { MultiSelect, Select, SelectItem } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import InvoicePreview from "./InvoicePreview";

const InvoiceCreateForm: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ show, setShow }) => {
  // data fetching
  const { isLoading: isPatientsLoading, data: patients } = trpc.useQuery([
    "get_all_patients",
  ]);
  const { isLoading: isDoctorsLoading, data: doctors } = trpc.useQuery([
    "get_all_doctors",
  ]);
  const { isLoading: isProductsLoading, data: products } = trpc.useQuery([
    "get_all_products",
  ]);

  //   patient select states
  const [selectedPatient, setSelectedPatient] =
    useState<InferQueryOutput<"get_all_patients">[number]>();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  //   patient's plan select states
  const [selectedPatientPlanId, setSelectedPatientPlanId] =
    useState<string>("");
  const [selectedPatientPlan, setSelectedPatientPlan] =
    useState<
      InferQueryOutput<"get_all_patients">[number]["treatmentPlans"][number]
    >();

  // select component states
  const [isPlanSelectDisabled, setIsPlanSelectDisabled] =
    useState<boolean>(true);
  const [plansSelectData, setPlansSelectData] = useState<SelectItem[]>([]);

  // doctor select state
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] =
    useState<InferQueryOutput<"get_all_doctors">[number]>();

  //   timestamp state
  const [timestamp, setTimestamp] = useState(new Date());

  // consultation fee
  const [consultationFee, setConsultationFee] = useState<number>(200);

  // plan ammount paying
  const [planAmmountPaying, setPlanAmmountPaying] = useState<number>(0);

  // product select states
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] =
    useState<InferQueryOutput<"get_all_products">>();

  // isEdit logic
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    selectedDoctorId !== "" &&
    selectedPatientId !== "" &&
    selectedPatientPlanId !== ""
      ? setIsEdit(true)
      : setIsEdit(false);
  }, [selectedDoctorId, selectedPatientId, selectedPatientPlanId]); // required fields only!

  // preview logic
  const [showPreview, setShowPreview] = useState(false);

  // change the selected patient, doctor, patientPlan and products
  useEffect(() => {
    selectedPatientId !== "" &&
      setSelectedPatient(
        patients?.find((patient) => patient.id === selectedPatientId)
      );

    selectedDoctorId !== "" &&
      setSelectedDoctor(
        doctors?.find((doctor) => doctor.id === selectedDoctorId)
      );

    selectedPatientPlanId !== "" &&
      selectedPatient &&
      setSelectedPatientPlan(
        selectedPatient?.treatmentPlans.find(
          (plan) => plan.id === selectedPatientPlanId
        )
      );
    console.log(selectedProductIds);

    selectedProductIds.length !== 0 &&
      setSelectedProducts(
        products?.filter((product) => selectedProductIds.includes(product.id))
      );
  }, [
    selectedPatientId,
    selectedDoctorId,
    selectedPatientPlanId,
    selectedProductIds,
    selectedProducts,
    doctors,
    patients,
    products,
    selectedPatient,
  ]);

  // for the plan
  useEffect(() => {
    if (selectedPatient) {
      setPlansSelectData(
        selectedPatient.treatmentPlans.map((plan) => ({
          label: plan.plan.name,
          value: plan.id,
        }))
      );

      setIsPlanSelectDisabled(false);
    }
  }, [selectedPatient]);

  if (
    isPatientsLoading ||
    !patients ||
    isDoctorsLoading ||
    !doctors ||
    isProductsLoading ||
    !products
  )
    return <Loader />;

  return (
    <Modal show={show} setShow={setShow} title="Create Invoice">
      {/* Patient */}
      <div className="my-6">
        <Select
          label="Patient"
          description="Pick up a patient to create invoice for."
          searchable
          radius="md"
          variant="filled"
          icon={<UserIcon className="w-5" />}
          nothingFound="Oops! no patient found."
          placeholder="Pick a patient"
          data={patients.map((patient) => ({
            value: patient.id,
            label: `${patient.firstName} ${patient.lastName}`,
          }))}
          value={selectedPatientId}
          onChange={(val) => val && setSelectedPatientId(val)}
          required
        />
      </div>

      {/* doctor */}
      <div className="mb-6">
        <Select
          label="Doctor"
          description="Doctor incharge of the patient"
          placeholder="Pick the doctor"
          radius="md"
          variant="filled"
          data={doctors.map((doctor) => ({
            label: `${doctor.firstName} ${doctor.lastName}`,
            value: doctor.id,
          }))}
          value={selectedDoctorId}
          onChange={(val) => val && setSelectedDoctorId(val)}
          required
        />
      </div>

      {/* Timestamp */}
      <div className="mb-6 flex gap-x-4 items-center">
        <DatePicker
          label="Date"
          radius="md"
          variant="filled"
          icon={<CalendarIcon className="w-5 text-primaryLight" />}
          placeholder="Pick a date"
          value={timestamp}
          onChange={(date) =>
            date &&
            setTimestamp((oldDate) => new Date(oldDate.setDate(date.getDate())))
          }
        />
        <TimeInput
          label="Time"
          placeholder="Pick a time"
          radius="md"
          variant="filled"
          format="12"
          icon={<ClockIcon className="w-5 text-primaryLight" />}
          value={timestamp}
          onChange={(time) =>
            setTimestamp((oldTime) => new Date(oldTime.setTime(time.getTime())))
          }
        />
      </div>

      {/* Patient's Treatment Plan */}
      <div className="mb-6">
        <Select
          label="Patient's Treatment Plan"
          description="Pick a Treatment Plan attached with the selected Patient"
          placeholder="Pick a plan"
          radius="md"
          variant="filled"
          icon={<TemplateIcon className="w-5" />}
          disabled={isPlanSelectDisabled}
          data={plansSelectData}
          value={selectedPatientPlanId}
          onChange={(val) => val && setSelectedPatientPlanId(val)}
          required
        />
      </div>

      <div className="mb-6 flex gap-x-2 items-center">
        {/* Consultation Fee */}
        <div>
          <label
            htmlFor="consultationFee"
            className="block mb-2 text-sm font-medium"
          >
            Consultation Fee
            <p className="labelDescription">Consultation Fee Ammount</p>
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-primaryLight">
              <CurrencyRupeeIcon className="w-5" />
            </div>
            <input
              type="number"
              min="0"
              id="consultationFee"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
              placeholder="200"
              value={consultationFee}
              onChange={(e) => setConsultationFee(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Plan Ammount Paying */}
        <div>
          <label
            htmlFor="planAmmountPaying"
            className="block mb-2 text-sm font-medium"
          >
            Plan Ammount Paying
            <p className="labelDescription">
              Ammount paying for treatment plan
            </p>
          </label>
          <div className="relative">
            <div className="text-primaryLight flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <CurrencyRupeeIcon className="w-5" />
            </div>
            <input
              type="number"
              min="0"
              id="planAmmountPaying"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
              placeholder="200"
              value={planAmmountPaying}
              onChange={(e) => setPlanAmmountPaying(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mb-6">
        <MultiSelect
          label="Products"
          description="Products purchased"
          radius="md"
          variant="filled"
          icon={<ShoppingBagIcon className="w-5" />}
          placeholder="Pick product(s)"
          data={products.map((product) => ({
            value: product.id,
            label: product.name,
          }))}
          value={selectedProductIds}
          onChange={(vals) => setSelectedProductIds(vals)}
          searchable
          nothingFound="Oops! nothing found."
        />
      </div>
      {/* Preview Button */}
      <div className="flex justify-end">
        <button
          className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
          disabled={!isEdit}
          onClick={() => setShowPreview(true)}
        >
          Preview
        </button>
        <InvoicePreview
          show={showPreview}
          setShow={setShowPreview}
          invoice={{
            consultationFee,
            timestamp,
            planAmmountPaying,
            patient: {
              name: `${selectedPatient?.firstName} ${selectedPatient?.lastName}`,
            },
            doctor: {
              name: `${selectedDoctor?.firstName} ${selectedDoctor?.lastName}`,
            },
            plan: {
              name: selectedPatientPlan?.plan.name!,
              price: selectedPatientPlan?.plan.price!,
            },
            products:
              selectedProducts?.map((product, index) => ({
                discountPercentage: product.discountPercentage,
                mrp: product.mRP,
                name: product.name,
              })) || [],
          }}
        />
      </div>
    </Modal>
  );
};

export default InvoiceCreateForm;
