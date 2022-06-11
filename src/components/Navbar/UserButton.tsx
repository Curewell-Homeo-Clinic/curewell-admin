import Image from "next/image";
import { useState } from "react";

interface UserButtonProps {
  open: boolean;
}

export default function UserButton({ open }: UserButtonProps) {
  const [user] = useState({
    name: "Khushal Bhardwaj",
    email: "khushalbhardwaj0111@gmail.com",
    profileImg:
      "https://avatars.githubusercontent.com/u/76873719?s=400&u=c54f090bce39cdc8dc941cd5b9050ecf6547c2ed&v=4",
  });

  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div
      onClick={() => setOpenDropdown(!openDropdown)}
      className={`gap-x-4 absolute bottom-0 mb-4 text-gray-300 text-sm flex items-center justify-between cursor-pointer p-2 hover:bg-[#ffffff2b] rounded-md mt-2 duration-300`}
    >
      <Image
        width={30}
        height={30}
        layout="fixed"
        src={user.profileImg}
        alt="logoutIcon"
        className="bg-gray-100 rounded-full"
      />
      <div
        className={`flex flex-col ${
          !open && "hidden"
        } origin-left duration-200`}
      >
        <span>{user.name}</span>
        <span className="text-gray-400">{`${user.email.substring(
          0,
          23
        )}...`}</span>
      </div>
    </div>
  );
}
