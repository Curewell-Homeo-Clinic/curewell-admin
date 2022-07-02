import { Modal } from "@/components/shared";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProductCreateForm: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ show, setShow }) => {
  const [name, setName] = useState("");
  const [mRP, setMRP] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();
  const productCreateMutation = trpc.useMutation(["create_product"]);

  const handleSave = async () => {
    (await productCreateMutation.mutateAsync({
      mRP,
      name,
      quantity,
    })) && router.reload();
  };

  useEffect(() => {
    name !== "" && mRP != 0 && quantity !== 0
      ? setIsEdit(true)
      : setIsEdit(false);
  }, [mRP, quantity, name, isEdit]);

  return (
    <Modal show={show} setShow={setShow} title="add new product">
      <form className="mt-4 min-w-full" onSubmit={(e) => e.preventDefault()}>
        {/* Name */}
        <div className="my-6">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
            placeholder="Shampoo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* MRP */}
        <div className="mb-6">
          <label htmlFor="mRP" className="block mb-2 text-sm font-medium">
            MRP
          </label>
          <input
            type="number"
            min="0"
            id="mRP"
            className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
            placeholder="12"
            value={mRP}
            onChange={(e) => setMRP(parseInt(e.target.value))}
          />
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label htmlFor="qty" className="block mb-2 text-sm font-medium">
            Quantity
          </label>
          <input
            type="number"
            min="0"
            id="qty"
            className="bg-gray-50 border capitalize border-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-primary block w-full p-2.5 "
            placeholder="12"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            className="disabledBtn"
            disabled={isEdit ? false : true}
            onClick={handleSave}
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductCreateForm;
