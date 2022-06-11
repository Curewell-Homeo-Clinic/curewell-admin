import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Navbar />
      <div className="p-5 pt-8 text-2xl font-semibold flex-1 h-screen">
        {children}
      </div>
    </div>
  );
}
