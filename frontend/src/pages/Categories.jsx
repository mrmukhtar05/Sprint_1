import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import api from "../api/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/categories");

        if (response.data?.success) {
          setCategories(response.data.categories || []);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Fetch categories error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load categories."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Explore our vintage collections."
      />

      <main className="mx-auto w-full px-5 py-12">
        {/* Loading */}
        {loading && (
          <div className="py-20 text-center font-black">
            LOADING CATEGORIES...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-20 text-center text-red-500">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && categories.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-black">
              NO CATEGORIES FOUND
            </h2>
          </div>
        )}

        {/* Categories */}
        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                to={`/shop?category=${category._id}`}
                className="
                  group
                  relative
                  h-64
                  overflow-hidden
                  border-2
                  border-[var(--gold)]
                  bg-[var(--blue)]
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-[8px_8px_0_var(--gold)]
                "
              >
                {/* Category Image */}
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--blue)]" />
                )}

                {/* Dark Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/45
                    transition-all
                    duration-300
                    group-hover:bg-black/25
                  "
                />

                {/* Content */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    z-10
                    p-6
                  "
                >
                  <p className="text-xs font-bold tracking-[0.25em] text-[var(--gold)]">
                    COLLECTION{" "}
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h2
                    className="
                      mt-2
                      text-3xl
                      font-black
                      uppercase
                      text-white
                    "
                  >
                    {category.name}
                  </h2>

                  {category.slug && (
                    <p
                      className="
                        mt-2
                        text-xs
                        uppercase
                        tracking-widest
                        text-white/60
                      "
                    >
                      {category.slug}
                    </p>
                  )}

                  <span
                    className="
                      mt-3
                      inline-block
                      text-xs
                      font-black
                      text-[var(--gold)]
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:translate-x-2
                      group-hover:opacity-100
                    "
                  >
                    SHOP NOW →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}