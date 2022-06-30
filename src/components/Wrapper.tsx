import { STATES } from "@/store";
import { capitalizeFirst } from "@/utils";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Navbar, { NavbarProps } from "./Navbar";
import { Loader } from "./shared";

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

  const { isLoaded, isSignedIn, user } = useUser();
  const setIsAdmin = useSetRecoilState(STATES.isAdmin);

  useEffect(() => {
    isLoaded &&
      isSignedIn &&
      setIsAdmin(user.username?.includes("admin") ? true : false);
  }, [isSignedIn]);

  return (
    <>
      <Head>
        <title>{capitalizeFirst(getActiveMenu())} | Curewell Homeo</title>
      </Head>
      <div className="flex">
        <Navbar active={getActiveMenu()} />
        <div className="p-5 pt-8 flex-1 h-screen overflow-y-auto text-primary">
          {isLoaded ? children : <Loader />}
        </div>
      </div>
    </>
  );
}
