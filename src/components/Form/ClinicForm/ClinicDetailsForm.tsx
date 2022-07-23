import { FormOptions } from "@/components/shared";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";

const ClinicDetailsForm: React.FC<{
  clinic: InferQueryOutput<"clinic.get">;
}> = ({ clinic }) => {
  const [name, setName] = useState(clinic?.name!);
  const [address, setAddress] = useState(clinic?.address!);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleReset = () => {
    setName(clinic?.name!);
    setAddress(clinic?.address!);

    setIsEdit(false);
  };

  const trpcCtx = trpc.useContext();
  const mutation = trpc.useMutation("clinic.update", {
    onSuccess() {
      trpcCtx.invalidateQueries(["clinic.get", { id: clinic?.id! }]);
      trpcCtx.invalidateQueries("clinic.getAll");
    },
  });

  const handleSave = async () => {
    await mutation.mutateAsync({
      id: clinic?.id!,
      name,
      address,
    });
  };

  useEffect(() => {
    if (name !== clinic?.name || address !== clinic?.address) setIsEdit(true);
    else setIsEdit(false);
  }, [name, address, isEdit, clinic?.name, clinic?.address]);

  if (!clinic) return null;

  return (
    <form
      style={{ flex: 0.5 }}
      className="mt-4 border-2 border-primary shadow-lg rounded-lg p-6 px-10 items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1>Clinic Details</h1>
      <div className="my-6">
        <label htmlFor="name" className="block mb-2 text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
          placeholder="Clinic's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="address" className="block mb-2 text-sm font-medium">
          Address
        </label>
        <textarea
          id="address"
          rows={10}
          spellCheck={false}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
          placeholder="Clinic's Full Address"
        ></textarea>
      </div>

      <FormOptions
        handleReset={handleReset}
        handleSave={handleSave}
        isEdit={isEdit}
      />
    </form>
  );
};

export default ClinicDetailsForm;
