import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useProducts } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products, loading, error } = useProducts();

  const {
    categories,
    loading: categoriesLoading,
  } = useCategories();

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api
      .get("/home")
      .then((res) => {
        setSettings(res.data?.settings || null);
      })
      .catch((err) => {
        console.error("Home settings error:", err);
      });
  }, []);

  const home = settings || {};

  const stats = home.stats?.length
    ? home.stats
    : [
        { value: "3K+", label: "PIECES" },
        { value: "100%", label: "CURATED" },
        { value: "2021", label: "EST." },
      ];

  return (
    <main className="overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden border-b-2 border-[var(--gold)] bg-[#080a0b]">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,#063c5c_0%,#080a0b_50%,#080a0b_100%)]" />

        {/* Blue Border */}
        <div className="absolute right-[-50px] top-[80px] z-10 hidden h-[420px] w-[760px] rotate-[-12deg] items-center justify-center rounded-[50%] border-[14px] border-[#0b4265] lg:flex" />

        {/* Gold Border */}
        <div className="absolute right-[-50px] top-[72px] z-10 hidden h-[430px] w-[770px] rotate-[-12deg] rounded-[50%] border-2 border-[#e9a91a] lg:block" />

        {/* Hero Image */}
        <div className="absolute right-[-50px] top-[80px] z-20 hidden h-[420px] w-[760px] rotate-[-12deg] items-center justify-center lg:flex">
          <img
            src={home.heroImage || logo}
            alt="Vintage Vault"
            className="mr-25 max-h-full w-full object-contain"
          />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[560px] w-full items-center px-6 py-16 sm:px-10 lg:grid-cols-2 lg:px-16">

          {/* HERO LEFT */}
          <div className="max-w-[620px]">

            {/* Small Heading */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#e9a91a]" />

              <p className="text-xs font-black tracking-[0.3em] text-[#e9a91a]">
                {home.eyebrow || "VINTAGE • STREETWEAR • GRAILS"}
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="text-[clamp(2.75rem,5.5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
              {home.titleLine1 || "WEAR THE"}
              <br />

              <span className="text-[#e9a91a]">
                {home.titleLine2 || "PAST."}
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-[450px] text-sm leading-7 text-[#d5cbb9] sm:text-base">
              {home.description ||
                "Curated vintage pieces, rare streetwear and timeless grails for people who wear their own story."}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to={home.primaryButtonLink || "/shop"}
                className="border-2 border-black bg-[#d83b32] px-7 py-4 font-black text-black shadow-[5px_5px_0_#e9a91a] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                {home.primaryButtonText || "SHOP NOW →"}
              </Link>

              <Link
                to={home.secondaryButtonLink || "/categories"}
                className="border-2 border-[#e9a91a] px-7 py-4 font-black text-[#e9a91a] transition-all duration-200 hover:bg-[#e9a91a] hover:text-black"
              >
                {home.secondaryButtonText || "EXPLORE"}
              </Link>

            </div>

            {/* Stats */}
            <div className="mt-10 flex gap-7 border-t border-white/10 pt-6">

              {stats.slice(0, 3).map((stat) => (
                <div key={`${stat.value}-${stat.label}`}>
                  <b className="text-xl text-[#e9a91a]">
                    {stat.value}
                  </b>

                  <p className="text-[10px] text-[#aaa69b]">
                    {stat.label}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <section className="overflow-hidden bg-[var(--blue)] py-16">

        {/* Heading */}
        <div className="mx-auto px-5 sm:px-8 lg:px-12">

          <p className="text-xs font-black tracking-[0.3em] text-[var(--gold)]">
            EXPLORE COLLECTIONS
          </p>

          <h2 className="mt-2 text-4xl font-black uppercase sm:text-5xl">
            SHOP BY CATEGORY
          </h2>

        </div>


        {/* Loading Categories */}
        {categoriesLoading ? (
          <div className="mt-10 py-16 text-center font-black text-[var(--gold)]">
            LOADING CATEGORIES...
          </div>
        ) : categories?.length === 0 ? (
          <div className="mt-10 py-16 text-center">
            <p className="font-black text-white/60">
              NO CATEGORIES FOUND
            </p>
          </div>
        ) : (

          /* Marquee */
          <div className="relative mt-10 w-full overflow-hidden">

            {/* Left Fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[var(--blue)] to-transparent sm:w-24" />

            {/* Right Fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-[var(--blue)] to-transparent sm:w-24" />


            {/* Moving Track */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">

              {/* =================================================
                  FIRST SET
              ================================================= */}
              <div className="flex shrink-0 gap-5 px-2 sm:px-3">

                {categories.map((category, index) => (

                  <Link
                    to={`/shop?category=${category.slug}`}
                    key={`first-${category._id}-${index}`}
                    className="
                      group
                      relative
                      h-[clamp(170px,13vw,210px)]
                      w-[clamp(200px,16vw,260px)]
                      shrink-0
                      overflow-hidden
                      border-2
                      border-[var(--gold)]
                      bg-[#173b50]
                      transition-all
                      duration-500
                      hover:-translate-y-3
                      hover:shadow-[8px_8px_0_#000]
                    "
                  >

                    {/* Category Image */}
                    <div className="absolute inset-0 flex items-center justify-center">

                      <img
                        src={category.image || logo}
                        alt={category.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-all
                          duration-700
                          group-hover:scale-110
                        "
                      />

                    </div>


                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 transition-all duration-500 group-hover:bg-black/20" />


                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">

                      <p className="text-[10px] font-bold tracking-[0.3em] text-white/70">
                        VINTAGE VAULT
                      </p>

                      <h3 className="mt-1 text-2xl font-black italic tracking-tight text-white transition-transform duration-500 group-hover:translate-x-3 sm:text-3xl">
                        {category.name}
                      </h3>

                      <span className="mt-2 inline-block text-xs font-black text-[var(--gold)] opacity-0 transition-all duration-500 group-hover:translate-x-3 group-hover:opacity-100">
                        SHOP NOW →
                      </span>

                    </div>

                  </Link>

                ))}

              </div>


              {/* =================================================
                  SECOND SET
              ================================================= */}
              <div className="flex shrink-0 gap-5 px-2 sm:px-3">

                {categories.map((category, index) => (

                  <Link
                    to={`/shop?category=${category.slug}`}
                    key={`second-${category._id}-${index}`}
                    className="
                      group
                      relative
                      h-[clamp(170px,13vw,210px)]
                      w-[clamp(200px,16vw,260px)]
                      shrink-0
                      overflow-hidden
                      border-2
                      border-[var(--gold)]
                      bg-[#173b50]
                      transition-all
                      duration-500
                      hover:-translate-y-3
                      hover:shadow-[8px_8px_0_#000]
                    "
                  >

                    {/* Category Image */}
                    <div className="absolute inset-0 flex items-center justify-center">

                      <img
                        src={category.image || logo}
                        alt={category.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-all
                          duration-700
                          group-hover:scale-110
                        "
                      />

                    </div>


                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 transition-all duration-500 group-hover:bg-black/20" />


                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">

                      <p className="text-[10px] font-bold tracking-[0.3em] text-white/70">
                        VINTAGE VAULT
                      </p>

                      <h3 className="mt-1 text-2xl font-black italic tracking-tight text-white transition-transform duration-500 group-hover:translate-x-3 sm:text-3xl">
                        {category.name}
                      </h3>

                      <span className="mt-2 inline-block text-xs font-black text-[var(--gold)] opacity-0 transition-all duration-500 group-hover:translate-x-3 group-hover:opacity-100">
                        SHOP NOW →
                      </span>

                    </div>

                  </Link>

                ))}

              </div>

            </div>

          </div>

        )}

      </section>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}
      <section className="bg-[var(--black)] px-5 py-16 sm:px-8 lg:px-12">

        <div className="mx-auto w-full">

          {/* Heading */}
          <p className="text-xs font-black tracking-[0.25em] text-[var(--gold)]">
            CURATED FOR YOU
          </p>

          <h2 className="mt-2 text-4xl font-black uppercase sm:text-5xl">
            TRENDING GRAILS
          </h2>


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
            products.length === 0 && (
              <div className="py-20 text-center">
                <h2 className="text-2xl font-black">
                  NO PRODUCTS FOUND
                </h2>
              </div>
            )}


          {/* Product Grid */}
          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {products.slice(0, 8).map((product, index) => (

                  <div
                    key={product._id}
                    className="animate-card-in"
                    style={{
                      animationDelay: `${index * 80}ms`,
                    }}
                  >
                    <ProductCard product={product} />
                  </div>

                ))}

              </div>
            )}

        </div>

      </section>

    </main>
  );
}