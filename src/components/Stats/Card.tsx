interface StatsCardProps {
  stats: {
    title: string;
    val: string;
    Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  };
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="hover:scale-110 realtive ease-out duration-500 flex items-center cursor-pointer py-4 px-6 justify-between border-2 border-primary text-primary bg-lightWhite rounded-lg shadow-lg hover:shadow-2xl drop-shadow-xl">
      <stats.Icon className="w-16 p-2 mr-2" />
      <div className="flex flex-col justify-center items-start">
        <p className="text-2xl font-medium select-none">{stats.val}</p>
        <p className="secondaryText">{stats.title}</p>
      </div>
    </div>
  );
}
