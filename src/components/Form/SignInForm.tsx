import { useSignIn } from "@clerk/nextjs";
import { MailIcon, PhoneIcon, ShieldCheckIcon } from "@heroicons/react/outline";
import { Group, Stepper } from "@mantine/core";
import { useState } from "react";
import Loader from "../shared/Loader";

export default function SignInForm() {
  const [email, setEmail] = useState<string>();
  const { signIn, isLoaded } = useSignIn();

  const handleSignIn = () => {
    email &&
      email !== "" &&
      signIn?.create({
        strategy: "email_link",
        identifier: email,
      });
  };

  if (!isLoaded) return <Loader />;

  return (
    <div className="flex w-2/5 min-w-fit items-center justify-center">
      <form
        className="flex-1 mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1>Sign In</h1>

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <MailIcon className="w-5" />
            </div>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full pl-10 p-2.5 "
              placeholder="name@curewellhomeo.com"
              value={email}
              spellCheck={false}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
