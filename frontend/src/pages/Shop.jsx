import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";
import api from "../api/api";

export default function Shop() {
  const { products, loading, error, fetchProducts } = useProducts();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const categoryParam = searchParams.get("category") || "";

  const [category, setCategory] = useState(categoryParam || "All");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ ...(keyword ? { keyword } : {}), ...(categoryParam ? { category: categoryParam } : {}), ...(gender ? { gender } : {}) });
  }, [keyword, categoryParam, gender]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);

        const response = await api.get("/categories");

        if (response.data?.success) {
          setCategories(response.data.categories || []);
        }
      } catch (err) {
        console.error("Fetch categories error:", err);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filtered = products;

  return (
    <>
      <PageHeader
        title={keyword ? `Search: ${keyword}` : "Shop"}
        subtitle="Find your next vintage grail."
      />

      <main className="mx-auto w-full px-5 py-10">

        {/* Gender */}
        <div className="mb-4 flex flex-wrap gap-2">
          {[['','ALL'],['men','MEN'],['women','WOMEN'],['unisex','UNISEX']].map(([value,label]) => (
            <button key={label} onClick={() => { setGender(value); setCategory("All"); }} className={`px-4 py-2 text-xs font-black ${gender === value ? "bg-[var(--gold)] text-black" : "border border-[var(--border)]"}`}>{label}</button>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => { setCategory("All"); fetchProducts({ ...(keyword ? { keyword } : {}), ...(gender ? { gender } : {}) }); }}
            className={`px-4 py-2 text-xs font-black ${
              category === "All"
                ? "bg-[var(--gold)] text-black"
                : "border border-[var(--border)]"
            }`}
          >
            All
          </button>

          {!categoryLoading &&
            categories.map((item) => (
              <button
                key={item._id}
                onClick={() => { setCategory(item._id); fetchProducts({ category:item._id, ...(keyword ? { keyword } : {}), ...(gender ? { gender } : {}) }); }}
                className={`px-4 py-2 text-xs font-black ${
                  category === item._id
                    ? "bg-[var(--gold)] text-black"
                    : "border border-[var(--border)]"
                }`}
              >
                {item.name}
              </button>
            ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center font-black">
            LOADING PRODUCTS...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-20 text-center text-red-500">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filtered.length === 0 && (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-black">
                NO PRODUCTS FOUND
              </h2>
            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}
      </main>
    </>
  );
}