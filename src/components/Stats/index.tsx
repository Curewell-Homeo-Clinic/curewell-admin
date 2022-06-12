import { useState } from "react";
import StatsCard from "./Card";

export default function Stats() {
  const [stats] = useState([
    {
      title: "Patients",
      val: "49",
      icon: "patients",
    },
    {
      title: "Appointments",
      val: "56",
      icon: "appointments",
    },
    {
      title: "Invoices",
      val: "34",
      icon: "invoices",
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
