import { SettingsNavbar } from "@/components";
import { SettingsNavbarProps } from "@/components/Navbar/SettingsNavbar";
import { STATES } from "@/store";
import { ScrollArea } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const useSubPage = (page: SettingsNavbarProps["active"]) => {
  switch (page) {
    case "general":
      return <div>general settings</div>;
    case "treatment_plans":
      return "plan settings";
    default:
      return null;
  }
};

export default function SettingsPage() {
  const [active, setActive] =
    useState<SettingsNavbarProps["active"]>("general");

  const page = useSubPage(active);

  const handleSettingsSubpageOpen = (page: SettingsNavbarProps["active"]) => {
    setActive(page);
  };

  const router = useRouter();
  const isAdmin = useRecoilValue(STATES.isAdmin);

  useEffect(() => {
    !isAdmin && router.back();
  }, []);

  return (
    <div className="h-5/6">
      <div className="p-2">
        <h1>Settings</h1>
      </div>
      <div className="py-8 flex min-h-full items-stretch">
        <SettingsNavbar
          active={active}
          handleSettingsSubpageOpen={handleSettingsSubpageOpen}
        />
        <div className="p-5 pt-8 flex-1 overflow-y-auto text-primary border-secondary border-2 border-l-0 rounded-r-lg">
          <ScrollArea
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
            style={{ height: "750px" }}
          >
            {page}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
