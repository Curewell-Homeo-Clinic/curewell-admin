import { Loader as MantineLoader } from "@mantine/core";

export default function Loader() {
  return (
    <div className="flex items-center justify-center p-2 w-full flex-1 h-full">
      <MantineLoader color="dark" size="xl" variant="bars" />
    </div>
  );
}
