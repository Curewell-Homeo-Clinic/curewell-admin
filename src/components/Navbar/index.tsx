import { useState } from "react";
import Image from "next/image";
import UserButton from "./UserButton";

export default function Navbar() {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Dashboard", src: "dashboard", active: true },
    { title: "Statistics", src: "statistics" },
    { title: "Patients", src: "patients", gap: true },
    { title: "Appointments", src: "appointments" },
    { title: "Invoices", src: "invoices" },
  ];

  return (
    <div
      className={`h-screen ${
        open ? "w-72" : "w-20"
      } duration-300 bg-[#081A51] relative p-5 pt-8 text-white`}
    >
      {/* Navbar Control */}
      {/*eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/navbarControl.svg"
        alt="control"
        onClick={() => setOpen(!open)}
        className={`absolute w-6 cursor-pointer duration-300 rounded-full -right-2.5 top-20 border-2 border-[#081a51] bg-white ${
          !open && "rotate-180"
        }`}
      />

      {/* Logo Section */}
      <div className="flex gap-x-4 items-center duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/logo.svg"
          alt="logo"
          className={`cursor-pointer w-10 duration-500 bg-[#1541c5] rounded-lg p-1 select-none ${
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
        {Menus.map((menu, index) => (
          <li
            key={index}
            className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-[#ffffff2b] rounded-md ${
              menu.gap ? "mt-9" : "mt-2"
            } duration-300 ${menu.active && "bg-[#ffffff2b]"}`}
          >
            <Image
              width={20}
              height={20}
              layout="fixed"
              src={`/icons/${menu.src}.svg`}
              alt={menu.src}
            />
            <span
              className={`${
                !open && "hidden"
              } origin-left duration-200 select-none`}
            >
              {menu.title}
            </span>
          </li>
        ))}
      </ul>
      <UserButton open={open} />
    </div>
  );
}
