export default function PageHeader({ title, subtitle }) {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--blue)] px-6 py-14">
      <div className="mx-auto w-full">
        <p className="text-xs font-black tracking-[0.3em] text-[var(--gold)]">VINTAGE VAULT</p>
        <h1 className="mt-2 text-5xl font-black uppercase">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-[var(--muted)]">{subtitle}</p>}
      </div>
    </section>
  );
}