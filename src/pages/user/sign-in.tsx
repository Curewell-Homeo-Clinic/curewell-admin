import { SignInForm } from "@/components/Form";
import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In | Curewell Homeo</title>
      </Head>
      <div className="flex items-center justify-center h-screen">
        <SignIn redirectUrl={"/"} />
      </div>
    </>
  );
}
