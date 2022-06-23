import { AdjustmentsIcon, TemplateIcon } from "@heroicons/react/outline";

export interface SettingsNavbarProps {
  active: "general" | "treatment_plans";
  handleSettingsSubpageOpen: (page: SettingsNavbarProps["active"]) => void;
}

interface Menu {
  title: string;
  active?: boolean;
  gap?: boolean;
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  name: SettingsNavbarProps["active"];
}

const getMenu = (active: SettingsNavbarProps["active"]): Menu[] => [
  {
    title: "General",
    active: active === "general",
    Icon: AdjustmentsIcon,
    name: "general",
  },
  {
    title: "Treatment Plans",
    active: active === "treatment_plans",
    Icon: TemplateIcon,
    gap: true,
    name: "treatment_plans",
  },
];

const SettingsNavbar: React.FC<SettingsNavbarProps> = ({
  active,
  handleSettingsSubpageOpen,
}) => {
  const Menus = getMenu(active);

  return (
    <div className="w-72 duration-300 bg-primary relative p-5 pt-8 text-white rounded-lg rounded-r-none">
      {/* Menu */}
      <ul>
        {Menus.map((Menu, index) => (
          <li
            key={index}
            className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-[#ffffff2b] rounded-md ${
              Menu.gap ? "mt-9" : "mt-2"
            } duration-300 ${Menu.active && "bg-[#ffffff2b]"}`}
            onClick={() => handleSettingsSubpageOpen(Menu.name)}
          >
            <Menu.Icon className="w-5" />
            <span className="origin-left duration-200 select-none">
              {Menu.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsNavbar;
