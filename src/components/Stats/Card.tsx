import { useState } from "react";

interface StatsCardProps {
  stats: {
    title: string;
    val: string;
    icon: string;
  };
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="hover:scale-110 ease-out gap-x-6 duration-500 flex items-center cursor-pointer py-4 px-6 justify-between border-2 border-[#081A51] bg-[#ffffff2b] rounded-lg shadow-lg hover:shadow-2xl drop-shadow-xl">
      <div className="flex flex-col justify-center items-end">
        <p className="text-2xl font-medium select-none">{stats.val}</p>
        <p className="text-sm font-light text-gray-600 select-none">
          {stats.title}
        </p>
      </div>
      <img
        src={`/icons/${stats.icon}.svg`}
        className="bg-[#081A51] w-12 rounded-xl p-2"
      />
    </div>
  );
}
