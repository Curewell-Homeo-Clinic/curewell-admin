import { XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import {
  BriefcaseIcon,
  LocationMarkerIcon,
  MailIcon,
  PhoneIcon,
} from "@heroicons/react/outline";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Modal } from "@/components/shared";

const PatientCreateForm: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ show, setShow }) => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [ailments, setAilments] = useState("");
  const [age, setAge] = useState(0);

  const [isEdit, setIsEdit] = useState(false);

  const createMutation = trpc.useMutation(["patients.create"]);

  const handleSave = async () => {
    (await createMutation.mutateAsync({
      firstName,
      lastName,
      phone: phoneNo,
      email,
      address,
      occupation,
      ailments,
      age,
    })) && router.reload();
  };

  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      phoneNo !== "" &&
      email !== "" &&
      address !== "" &&
      occupation !== "" &&
      ailments !== "" &&
      age !== 0
    ) {
      setIsEdit(true);
    } else setIsEdit(false);
  }, [firstName, lastName, phoneNo, email, address, occupation, ailments, age]);

  return (
    <Modal show={show} setShow={setShow} title="add new patient">
      <form className="mt-4 min-w-full" onSubmit={(e) => e.preventDefault()}>
        <div className="flex mb-6 mt-6 gap-x-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
              placeholder="reshu"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
              placeholder="sharma"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Phone No */}
        <div className="mb-6">
          <label htmlFor="phoneNo" className="block mb-2 text-sm font-medium">
            Phone Number
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <PhoneIcon className="w-5" />
            </div>
            <input
              type="tel"
              id="phoneNo"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
              placeholder="9090230423"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              maxLength={10}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <MailIcon className="w-5" />
            </div>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
              placeholder="name@curewellhomeo.com"
              value={email}
              spellCheck={false}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Age */}
        <div className="mb-6">
          <label htmlFor="age" className="block mb-2 text-sm font-medium">
            Age
          </label>
          <input
            type="number"
            min="0"
            id="age"
            spellCheck={false}
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
            placeholder="23"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
          />
        </div>

        {/* Occupation */}
        <div className="mb-6">
          <label
            htmlFor="occupation"
            className="block mb-2 text-sm font-medium"
          >
            Occupation
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <BriefcaseIcon className="w-5" />
            </div>
            <input
              type="text"
              id="occupation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 pl-10"
              placeholder="Doctor"
              value={occupation}
              spellCheck={false}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label htmlFor="address" className="block mb-2 text-sm font-medium">
            Address
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <LocationMarkerIcon className="w-5" />
            </div>
            <input
              type="text"
              id="address"
              value={address}
              placeholder="1234 Main St"
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full pl-10 p-4 border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-secondary focus:border-primary"
            />
          </div>
        </div>

        {/* Ailments */}
        <div className="mb-6">
          <label htmlFor="ailments" className="block mb-2 text-sm font-medium">
            Ailments
          </label>
          <input
            type="text"
            id="ailments"
            spellCheck={false}
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
            placeholder="skin disease"
            value={ailments}
            onChange={(e) => setAilments(e.target.value)}
          />
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
            disabled={isEdit ? false : true}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientCreateForm;
