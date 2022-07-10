import { XIcon } from "@heroicons/react/outline";
import { createPortal } from "react-dom";

const ModalWrapper: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
  maxWidth?: "xl" | "2xl";
}> = ({ show, setShow, title, children, maxWidth = "xl" }) => {
  return createPortal(
    <div
      tabIndex={-1}
      className={`${
        !show && "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 md:inset-0 h-modal md:h-full flex items-center justify-center`}
      style={{ background: "rgb(26 27 30 / 0.4)" }}
    >
      <div
        className={`relative p-4 w-full ${
          maxWidth === "xl" ? "max-w-xl" : "max-w-2xl"
        } h-full md:h-auto`}
      >
        <div className="relative bg-white rounded-lg shadow-lg">
          <button
            type="button"
            onClick={() => setShow(false)}
            className="absolute top-3 right-2.5 text-primary bg-transparent hover:bg-primaryLight hover:text-secondary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <XIcon className="w-5" />
          </button>
          <div className="p-6">
            <h1>{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.querySelector("#modal-root") as Element
  );
};

export default ModalWrapper;
