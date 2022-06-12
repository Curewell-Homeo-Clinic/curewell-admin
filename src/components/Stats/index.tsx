import { CalendarIcon, CashIcon, UsersIcon } from "@heroicons/react/outline";
import { useState } from "react";
import StatsCard from "./Card";

export default function Stats() {
  const [stats] = useState([
    {
      title: "Patients",
      val: "49",
      Icon: UsersIcon,
    },
    {
      title: "Appointments",
      val: "56",
      Icon: CalendarIcon,
    },
    {
      title: "Invoices",
      val: "34",
      Icon: CashIcon,
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
