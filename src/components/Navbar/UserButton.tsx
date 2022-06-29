import { useClerk, useUser } from "@clerk/nextjs";
import { LogoutIcon } from "@heroicons/react/outline";
import { Tooltip } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";

interface UserButtonProps {
  open: boolean;
}

export default function UserButton({ open }: UserButtonProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const router = useRouter();
  if (!isLoaded || !isSignedIn) return null;

  return (
    <div
      className={`absolute bottom-0 left-6 ${
        open ? "w-60" : "w-10"
      } mb-4 flex flex-col gap-2`}
    >
      {/*User Button  */}
      <div
        onClick={() => router.push("/user")}
        className="gap-x-4 text-gray-300 text-sm flex items-center cursor-pointer p-2 hover:bg-[#ffffff2b] rounded-md mt-2 duration-300"
      >
        <Image
          width={open ? 30 : 20}
          height={open ? 30 : 20}
          layout="fixed"
          src={user.profileImageUrl}
          alt="logoutIcon"
          className="bg-gray-100 rounded-full select-none duration-300"
        />
        <div
          className={`flex flex-col ${
            !open && "hidden"
          } origin-left duration-200`}
        >
          <span className="select-none">{user.fullName || "No Name"}</span>
          <span className="text-gray-400 select-none">
            {user.primaryEmailAddress?.emailAddress}
          </span>
          <span className="text-gray-400 select-none">
            {user.primaryPhoneNumber?.phoneNumber!}
          </span>
        </div>
      </div>
      <div
        onClick={() => signOut()}
        className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-[#ffffff2b] rounded-md duration-300"
      >
        <Tooltip
          className="flex"
          disabled={open}
          gutter={26}
          color="gray"
          label="Logout"
          position="right"
          placement="center"
          radius="md"
        >
          <LogoutIcon className="w-5" />
        </Tooltip>
        <span
          className={`${
            !open && "hidden"
          } origin-left duration-200 select-none`}
        >
          Logout
        </span>
      </div>
    </div>
  );
}
