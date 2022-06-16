import { getMoney } from "@/utils";
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
      val: getMoney(overallStats.sales),
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
    <div className="flex flex-wrap p-2 gap-10">
      {stats.map((stat) => (
        <StatsCard key={stat.title} stats={stat} />
      ))}
    </div>
  );
}
