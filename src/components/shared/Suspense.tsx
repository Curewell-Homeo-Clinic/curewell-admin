import { Suspense as ReactSuspense } from "react";
import Loader from "./Loader";

const Suspense: React.FunctionComponent<React.SuspenseProps> = ({
  children,
}) => <ReactSuspense fallback={<Loader />}>{children}</ReactSuspense>;

export default Suspense;
