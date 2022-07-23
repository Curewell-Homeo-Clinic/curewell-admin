import { useState } from "react";
import {
  ChevronLeftIcon,
  CollectionIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  CogIcon,
  TemplateIcon,
  OfficeBuildingIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Tooltip } from "@mantine/core";
import { useRecoilValue } from "recoil";
import { STATES } from "@/store";
import dynamic from "next/dynamic";

const UserButton = dynamic(() => import("./UserButton"), {
  suspense: false,
});

export interface NavbarProps {
  active:
    | "dashboard"
    | "products"
    | "patients"
    | "appointments"
    | "invoices"
    | "plans"
    | "settings"
    | "clinics";
}

const getMenu = (active: NavbarProps["active"], isAdmin: boolean) => {
  const menus = [
    {
      title: "Dashboard",
      active: active === "dashboard",
      Icon: CollectionIcon,
      url: "/",
    },
    {
      title: "Patients",
      Icon: UsersIcon,
      active: active === "patients",
      url: "/patients",
      gap: true,
    },
    {
      title: "Appointments",
      Icon: CalendarIcon,
      active: active === "appointments",
      url: "/appointments",
    },
    {
      title: "Invoices",
      Icon: DocumentTextIcon,
      active: active === "invoices",
      url: "/invoices",
    },
    {
      title: "Products",
      Icon: ShoppingBagIcon,
      active: active === "products",
      url: "/products",
    },
    {
      title: "Treatment Plans",
      Icon: TemplateIcon,
      active: active === "plans",
      url: "/plans",
    },
  ];
  if (isAdmin)
    return [
      ...menus,
      {
        title: "Clinics",
        Icon: OfficeBuildingIcon,
        active: active == "clinics",
        url: "/clinics",
        gap: true,
      },
      {
        title: "Settings",
        Icon: CogIcon,
        active: active == "settings",
        url: "/settings",
      },
    ];

  return menus;
};

export default function Navbar({ active }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const isAdmin = useRecoilValue(STATES.isAdmin);
  const router = useRouter();

  const Menus = getMenu(active, isAdmin);

  return (
    <div
      className={`h-screen ${
        open ? "w-72" : "w-20"
      } duration-300 bg-gradient-to-b from-primary to-secondary relative p-5 pt-8 text-white`}
    >
      {/* Navbar Control */}
      <ChevronLeftIcon
        onClick={() => setOpen(!open)}
        className={`absolute w-6 cursor-pointer duration-300 rounded-full -right-2.5 top-20 border-2 border-primary bg-white ${
          !open && "rotate-180"
        } text-primary`}
      />

      {/* Logo Section */}
      <div className="flex gap-x-4 items-center duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/favicon.svg"
          alt="logo"
          className={`cursor-pointer inline-block w-10 duration-500 bg-lightWhite rounded-lg p-2 select-none ${
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
            onClick={() => {
              router.push(Menu.url);
            }}
          >
            <Tooltip
              className="flex"
              disabled={open}
              gutter={26}
              color="gray"
              label={Menu.title}
              position="right"
              placement="center"
              radius="md"
            >
              <Menu.Icon className="w-5" />
            </Tooltip>
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
