import { useEffect, useState } from "react";
import api from "../api/api";

const initial = {
  eyebrow: "VINTAGE • STREETWEAR • GRAILS", titleLine1: "WEAR THE", titleLine2: "PAST.",
  description: "Curated vintage pieces, rare streetwear and timeless grails for people who wear their own story.", heroImage: "",
  primaryButtonText: "SHOP NOW →", primaryButtonLink: "/shop", secondaryButtonText: "EXPLORE", secondaryButtonLink: "/categories",
  stats: [{ value: "3K+", label: "PIECES" }, { value: "100%", label: "CURATED" }, { value: "2021", label: "EST." }],
};

export default function HomeSettings() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/admin/home").then((res) => res.data?.settings && setForm({ ...initial, ...res.data.settings })).catch(console.error);
  }, []);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const updateStat = (i, key, value) => setForm((p) => ({ ...p, stats: p.stats.map((s, idx) => idx === i ? { ...s, [key]: value } : s) }));

  const save = async (e) => {
    e.preventDefault(); setStatus("Saving...");
    try { await api.put("/admin/home", form); setStatus("Saved successfully"); }
    catch (err) { setStatus(err.response?.data?.message || "Save failed"); }
  };

  const input = (label, key, placeholder = "") => (
    <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-[2px] text-slate-500">{label}</span><input value={form[key] || ""} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-amber-400" /></label>
  );

  return (
    <form onSubmit={save} className="space-y-6">
      <div><p className="text-[10px] font-black tracking-[3px] text-amber-400">STOREFRONT CONTROL</p><h2 className="mt-2 text-3xl font-black">Home Page</h2><p className="mt-1 text-sm text-slate-500">Update the hero content without editing frontend code.</p></div>
      <section className="grid gap-5 rounded-2xl border border-white/10 bg-white/[.02] p-5 sm:p-7 lg:grid-cols-2">
        {input("Eyebrow", "eyebrow")}{input("Hero image URL", "heroImage", "https://...")}
        {input("Title line 1", "titleLine1")}{input("Title line 2", "titleLine2")}
        <label className="block lg:col-span-2"><span className="mb-2 block text-[10px] font-black uppercase tracking-[2px] text-slate-500">Description</span><textarea rows="4" value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-amber-400" /></label>
        {input("Primary button", "primaryButtonText")}{input("Primary link", "primaryButtonLink")}
        {input("Secondary button", "secondaryButtonText")}{input("Secondary link", "secondaryButtonLink")}
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/[.02] p-5 sm:p-7"><h3 className="mb-5 text-lg font-black">Hero Stats</h3><div className="grid gap-4 md:grid-cols-3">{form.stats.map((stat, i) => <div key={i} className="space-y-3 rounded-xl border border-white/10 p-4">{["value","label"].map((key) => <label key={key} className="block"><span className="mb-2 block text-[9px] font-black uppercase tracking-wider text-slate-500">{key}</span><input value={stat[key] || ""} onChange={(e) => updateStat(i,key,e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-amber-400" /></label>)}</div>)}</div></section>
      <div className="flex items-center justify-between gap-4"><span className="text-sm text-slate-500">{status}</span><button className="rounded-lg bg-amber-400 px-6 py-3 text-sm font-black text-black hover:opacity-90">SAVE HOME PAGE</button></div>
    </form>
  );
}
