import { ChevronDoubleLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const GoBackButton: React.FC<{ route?: string }> = ({ route }) => {
  const router = useRouter();
  return (
    <div className="p-2">
      <button
        className="btn flex items-center"
        onClick={() => {
          route ? router.push(route) : router.back();
        }}
      >
        <ChevronDoubleLeftIcon className="w-5 mr-1" />
        <span>Go Back</span>
      </button>
    </div>
  );
};

export default GoBackButton;
