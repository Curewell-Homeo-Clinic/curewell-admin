import { getMoney } from "@/utils";
import {
  CalendarIcon,
  CreditCardIcon,
  DocumentTextIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { SimpleGrid } from "@mantine/core";
import { useState } from "react";
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
    <SimpleGrid
      cols={4}
      spacing="lg"
      breakpoints={[
        { maxWidth: 980, cols: 3, spacing: "md" },
        { maxWidth: 755, cols: 2, spacing: "sm" },
        { maxWidth: 600, cols: 1, spacing: "sm" },
      ]}
    >
      {stats.map((stat) => (
        <StatsCard key={stat.title} stats={stat} />
      ))}
    </SimpleGrid>
  );
}
