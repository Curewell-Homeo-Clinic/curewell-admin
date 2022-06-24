import { capitalizeFirst } from "@/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Navbar, { NavbarProps } from "./Navbar";

export default function Wrapper({ children }: { children: ReactNode }) {
  const router = useRouter();

  const getActiveMenu = (): NavbarProps["active"] => {
    const path = router.asPath.slice(1);

    if (path === "" || path === "/") return "dashboard";

    const menus: Array<NavbarProps["active"]> = [
      "products",
      "patients",
      "appointments",
      "invoices",
      "plans",
      "settings",
    ];

    for (const menu of menus) {
      if (path.startsWith(menu)) {
        return menu;
      }
    }

    return "dashboard";
  };

  return (
    <>
      <Head>
        <title>{capitalizeFirst(getActiveMenu())} | Curewell Homeo</title>
      </Head>
      <div className="flex">
        <Navbar active={getActiveMenu()} />
        <div className="p-5 pt-8 flex-1 h-screen overflow-y-auto text-primary">
          {children}
        </div>
      </div>
    </>
  );
}
