import { useRouter } from "next/router";
import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Wrapper({
  children,
}: {
  children: ReactNode;
  activeMenu: string;
}) {
  const router = useRouter();

  const getActiveMenu = () => {
    const path = router.asPath.slice(1);

    if (path === "" || path === "/") return "dashboard";

    const menus = ["stats", "patients", "appointments", "invoices"];

    for (const menu of menus) {
      if (path.startsWith(menu)) {
        return menu;
      }
    }

    return "dashboard";
  };

  return (
    <div className="flex">
      {/* @ts-ignore */}
      <Navbar active={getActiveMenu()} />
      <div className="p-5 pt-8 flex-1 h-screen overflow-y-auto">{children}</div>
    </div>
  );
}
