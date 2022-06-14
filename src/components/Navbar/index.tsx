import { useState } from "react";
import UserButton from "./UserButton";
import {
  ChevronLeftIcon,
  CollectionIcon,
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
} from "@heroicons/react/outline";

interface NavbarProps {
  active: "dashboard" | "stats" | "patients" | "appointments" | "invoices";
}

const getMenu = (active: NavbarProps["active"]) => [
  {
    title: "Dashboard",
    active: active === "dashboard",
    Icon: CollectionIcon,
  },
  { title: "Statistics", Icon: ChartBarIcon, active: active === "stats" },
  {
    title: "Patients",
    Icon: UsersIcon,
    gap: true,
    active: active === "patients",
  },
  {
    title: "Appointments",
    Icon: CalendarIcon,
    active: active === "appointments",
  },
  { title: "Invoices", Icon: DocumentTextIcon, active: active === "invoices" },
];

export default function Navbar({ active }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const Menus = getMenu(active);

  return (
    <div
      className={`h-screen ${
        open ? "w-72" : "w-20"
      } duration-300 bg-[#081A51] relative p-5 pt-8 text-white`}
    >
      {/* Navbar Control */}
      <ChevronLeftIcon
        onClick={() => setOpen(!open)}
        className={`absolute w-6 cursor-pointer duration-300 rounded-full -right-2.5 top-20 border-2 border-[#081a51] bg-white ${
          !open && "rotate-180"
        }`}
        color="#081a51"
      />

      {/* Logo Section */}
      <div className="flex gap-x-4 items-center duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/logo.svg"
          alt="logo"
          className={`cursor-pointer inline-block w-10 duration-500 bg-[#1541c5] rounded-lg p-1 select-none ${
            open && "rotate-[360deg]"
          }`}
        />
        <h1
          className={`text-white text-xl font-medium origin-left ${
            !open && "scale-0"
          } select-none`}
        >
          Curewell Homeo
        </h1>
      </div>

      {/* Menu */}
      <ul className="pt-6">
        {Menus.map((Menu, index) => (
          <li
            key={index}
            className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-[#ffffff2b] rounded-md ${
              Menu.gap ? "mt-9" : "mt-2"
            } duration-300 ${Menu.active && "bg-[#ffffff2b]"}`}
          >
            <Menu.Icon className="w-5" />
            <span
              className={`${
                !open && "hidden"
              } origin-left duration-200 select-none`}
            >
              {Menu.title}
            </span>
          </li>
        ))}
      </ul>
      <UserButton open={open} />
    </div>
  );
}
