export default function About() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12">

      {/* HERO */}
      <section className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 lg:p-20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--gold)]">
          ABOUT VINTAGE VAULT
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-none sm:text-6xl lg:text-8xl">
          VINTAGE.
          <br />
          RARE.
          <br />
          YOURS.
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Vintage Vault is a curated destination for vintage clothing,
          rare streetwear and timeless pieces. We search for unique garments
          that deserve a second life.
        </p>
      </section>

      {/* STORY */}
      <section className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--gold)]">
            OUR STORY
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase sm:text-5xl">
            MORE THAN CLOTHES.
          </h2>

          <p className="mt-6 leading-7 text-[var(--muted)]">
            Every vintage piece has a story. From old-school sports jerseys
            to rare streetwear and classic everyday pieces, Vintage Vault
            brings together clothing with character.
          </p>

          <p className="mt-4 leading-7 text-[var(--muted)]">
            Our goal is simple: make it easier to discover authentic,
            distinctive vintage pieces without losing the feeling of finding
            something truly special.
          </p>
        </div>

        <div className="flex min-h-[350px] items-center justify-center border border-[var(--border)] bg-[var(--blue)] p-10">
          <div className="text-center">
            <div className="text-7xl font-black text-[var(--gold)]">
              VV
            </div>

            <p className="mt-4 text-sm font-black uppercase tracking-[0.25em]">
              VINTAGE VAULT
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-t border-[var(--border)] py-16 lg:py-20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--gold)]">
          WHY VINTAGE VAULT
        </p>

        <h2 className="mt-4 text-4xl font-black uppercase sm:text-5xl">
          BUILT FOR THE GRAIL HUNTERS.
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="border border-[var(--border)] bg-[var(--surface)] p-7">
            <span className="text-3xl font-black text-[var(--gold)]">
              01
            </span>

            <h3 className="mt-6 text-xl font-black uppercase">
              Curated Pieces
            </h3>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              We focus on distinctive vintage pieces instead of ordinary
              mass-market clothing.
            </p>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] p-7">
            <span className="text-3xl font-black text-[var(--gold)]">
              02
            </span>

            <h3 className="mt-6 text-xl font-black uppercase">
              Timeless Style
            </h3>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Classic styles never disappear. They evolve, return and become
              part of your own story.
            </p>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] p-7">
            <span className="text-3xl font-black text-[var(--gold)]">
              03
            </span>

            <h3 className="mt-6 text-xl font-black uppercase">
              Made To Be Worn
            </h3>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Vintage is not just about collecting. It is about wearing
              something that feels different.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="border border-[var(--gold)] bg-[var(--gold)] p-8 text-black sm:p-12 lg:p-16">
        <h2 className="text-4xl font-black uppercase sm:text-6xl">
          FIND YOUR NEXT GRAIL.
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-6">
          Explore our latest vintage drops and discover something that
          deserves a place in your wardrobe.
        </p>

        <a
          href="/shop"
          className="mt-7 inline-block bg-black px-7 py-4 text-sm font-black text-white transition hover:opacity-80"
        >
          EXPLORE SHOP →
        </a>
      </section>

    </main>
  );
}

