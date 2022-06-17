import { ChevronDoubleLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

export default function GoBackButton() {
  const router = useRouter();
  return (
    <div className="p-2">
      <button className="btn flex items-center" onClick={() => router.back()}>
        <ChevronDoubleLeftIcon className="w-5 mr-1" />
        <span>Go Back</span>
      </button>
    </div>
  );
}
