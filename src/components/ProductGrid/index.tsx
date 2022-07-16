import { InferQueryOutput } from "@/utils/trpc";
import { SearchIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { ProductCreateForm } from "../Form";
import ProductCard from "./ProductCard";

const ProductsGrid: React.FC<{
  products: InferQueryOutput<"products.getAll">;
}> = ({ products: allProducts }) => {
  const [products, setProducts] = useState(allProducts);
  const [search, setSearch] = useState("");

  // create modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search !== "") {
      const result = allProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(result);
    } else setProducts(allProducts);
  };

  return (
    <div className="p-2 mt-8">
      {/* Search */}
      <div className="mb-6 flex items-center justify-between">
        <form className="flex items-center" onSubmit={(e) => handleSearch(e)}>
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-secondary" />
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
              placeholder="Search"
              spellCheck={false}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="sr-only" type="submit" />
          </div>
        </form>
        <button className="btn" onClick={() => setShowCreateModal(true)}>
          Add
        </button>
        <ProductCreateForm
          show={showCreateModal}
          setShow={setShowCreateModal}
        />
      </div>
      <div className="flex flex-wrap gap-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
