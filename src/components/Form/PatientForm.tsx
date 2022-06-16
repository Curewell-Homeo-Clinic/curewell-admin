import {
  BriefcaseIcon,
  LocationMarkerIcon,
  MailIcon,
  PhoneIcon,
} from "@heroicons/react/outline";
import { Ailment } from "@prisma/client";
import { useState } from "react";

interface PatientFormProps {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    admittedAt: Date;
    phone: string;
    ailments: Ailment[];
    email: string;
    address: string;
    occupation: string;
  };
}

export default function PatientForm({ patient }: PatientFormProps) {
  const [firstName, setFirstName] = useState(patient.firstName);
  const [lastName, setLastName] = useState(patient.lastName);
  const [phoneNo, setPhoneNo] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email);
  const [address, setAddress] = useState(patient.address);
  const [occupation, setOccupation] = useState(patient.occupation);
  const [ailments, setAilments] = useState(patient.ailments);

  return (
    <div className="flex items-center justify-between mt-6">
      <form
        style={{ flex: 0.5 }}
        className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1>Personal Details</h1>
        <p className="secondaryText">Patient&apos;s Personal Information</p>

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
              className="bg-gray-50 border capitalize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
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
              className="bg-gray-50 border capitalize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
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
        <div className="mb-6">
          <label htmlFor="address" className="block mb-2 text-sm font-medium">
            Ailments
          </label>
          <div className="flex items-center gap-x-2 px-2">
            {ailments.map((ailment) => (
              <span
                key={ailment.id}
                className="bg-transparent border-2 border-secondary text-primary text-sm font-medium px-2.5 py-0.5 rounded-lg"
              >
                {ailment.name}
              </span>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
