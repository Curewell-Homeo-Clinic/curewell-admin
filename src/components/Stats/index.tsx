import { trpc } from "@/utils/trpc";
import {
  CalendarIcon,
  CreditCardIcon,
  DocumentTextIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import StatsCard from "./Card";

interface StatsProps {
  overallStats: {
    patients: number;
    invoices: number;
    appointments: number;
    sales: number;
  };
}

export default function Stats({ overallStats }: StatsProps) {
  const [stats] = useState([
    {
      title: "Sales",
      val: `₹ ${new String(overallStats.sales).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      )}`,
      Icon: CreditCardIcon,
    },
    {
      title: "Patients",
      val: new String(overallStats.patients).toString(),
      Icon: UsersIcon,
    },
    {
      title: "Appointments",
      val: new String(overallStats.appointments).toString(),
      Icon: CalendarIcon,
    },
    {
      title: "Invoices",
      val: new String(overallStats.invoices).toString(),
      Icon: DocumentTextIcon,
    },
  ]);
  return (
    <div className="flex p-2 gap-x-10">
      {stats.map((stat) => (
        <StatsCard key={stat.title} stats={stat} />
      ))}
    </div>
  );
}
