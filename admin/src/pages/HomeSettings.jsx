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
  const [heroFile, setHeroFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/admin/home")
      .then((res) => res.data?.settings && setForm({ ...initial, ...res.data.settings }))
      .catch((err) => setStatus(err.response?.data?.message || "Failed to load home settings"));
  }, []);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const updateStat = (i, key, value) => setForm((p) => ({ ...p, stats: p.stats.map((s, idx) => idx === i ? { ...s, [key]: value } : s) }));

  const chooseHero = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg","image/png","image/webp","image/svg+xml"].includes(file.type)) {
      setStatus("Use JPG, PNG, WebP or SVG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("Hero image must be smaller than 5MB.");
      return;
    }
    setHeroFile(file);
    setForm((p) => ({ ...p, heroImage: URL.createObjectURL(file) }));
    setStatus("");
  };

  const save = async (e) => {
    e.preventDefault();
    setStatus("Uploading & saving...");

    const data = new FormData();
    data.append("eyebrow", form.eyebrow || "");
    data.append("titleLine1", form.titleLine1 || "");
    data.append("titleLine2", form.titleLine2 || "");
    data.append("description", form.description || "");
    data.append("primaryButtonText", form.primaryButtonText || "");
    data.append("primaryButtonLink", form.primaryButtonLink || "");
    data.append("secondaryButtonText", form.secondaryButtonText || "");
    data.append("secondaryButtonLink", form.secondaryButtonLink || "");
    data.append("stats", JSON.stringify(form.stats || []));
    if (heroFile) data.append("heroImage", heroFile);

    try {
      const response = await api.put("/admin/home", data);
      if (response.data?.settings) setForm((p) => ({ ...p, ...response.data.settings }));
      setHeroFile(null);
      setStatus("Saved successfully");
    } catch (err) {
      setStatus(err.response?.data?.message || "Save failed");
    }
  };

  const input = (label, key, placeholder = "") => (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[2px] text-slate-500">{label}</span>
      <input value={form[key] || ""} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-amber-400" />
    </label>
  );

  return (
    <form onSubmit={save} className="space-y-6">
      <div><p className="text-[10px] font-black tracking-[3px] text-amber-400">STOREFRONT CONTROL</p><h2 className="mt-2 text-3xl font-black">Home Page</h2><p className="mt-1 text-sm text-slate-500">Update hero content and upload the hero image directly to Cloudinary.</p></div>

      <section className="grid gap-5 rounded-2xl border border-white/10 bg-white/[.02] p-5 sm:p-7 lg:grid-cols-2">
        {input("Eyebrow", "eyebrow")}
        <label className="block">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[2px] text-slate-500">Hero image</span>
          <div className="flex flex-wrap items-center gap-4">
            {form.heroImage && <img src={form.heroImage} alt="Hero preview" className="h-28 w-40 rounded-lg border border-white/10 object-cover" />}
            <label className="cursor-pointer rounded-lg border border-white/10 px-4 py-3 text-xs font-black hover:border-amber-400">
              {heroFile ? "CHANGE IMAGE" : "UPLOAD IMAGE"}
              <input hidden type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={chooseHero} />
            </label>
          </div>
          <small className="mt-2 block text-[10px] text-slate-500">JPG, PNG, WebP or SVG · max 5MB</small>
        </label>

        {input("Title line 1", "titleLine1")}{input("Title line 2", "titleLine2")}
        <label className="block lg:col-span-2"><span className="mb-2 block text-[10px] font-black uppercase tracking-[2px] text-slate-500">Description</span><textarea rows="4" value={form.description || ""} onChange={(e) => update("description", e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-amber-400" /></label>
        {input("Primary button", "primaryButtonText")}{input("Primary link", "primaryButtonLink")}
        {input("Secondary button", "secondaryButtonText")}{input("Secondary link", "secondaryButtonLink")}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[.02] p-5 sm:p-7"><h3 className="mb-5 text-lg font-black">Hero Stats</h3><div className="grid gap-4 md:grid-cols-3">{(form.stats || []).map((stat, i) => <div key={i} className="space-y-3 rounded-xl border border-white/10 p-4">{["value","label"].map((key) => <label key={key} className="block"><span className="mb-2 block text-[9px] font-black uppercase tracking-wider text-slate-500">{key}</span><input value={stat[key] || ""} onChange={(e) => updateStat(i,key,e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-amber-400" /></label>)}</div>)}</div></section>

      <div className="flex items-center justify-between gap-4"><span className="text-sm text-slate-500">{status}</span><button className="rounded-lg bg-amber-400 px-6 py-3 text-sm font-black text-black hover:opacity-90">SAVE HOME PAGE</button></div>
    </form>
  );
}
