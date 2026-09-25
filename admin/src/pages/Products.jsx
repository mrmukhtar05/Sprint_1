import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import SectionTitle from "../components/SectionTitle";

const MAX_IMAGES = 6;
const MAX_FILE_MB = 5;
const GENDERS = [["men", "Men"], ["women", "Women"], ["unisex", "Unisex"]];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "28", "30", "32", "34", "36", "38", "40", "42"];
const COLORS = ["Black", "White", "Blue", "Navy", "Grey", "Red", "Green", "Brown", "Beige", "Pink", "Yellow", "Purple"];
const emptyForm = { name:"", description:"", brand:"", category:"", gender:"unisex", sizes:["M","L"], colors:["Black"], price:"", discountPrice:"", stock:"", sku:"", tags:"", isFeatured:false, images:[] };

export default function Products() {
  const { products, loading, error: loadError, meta, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) =>
      (!genderFilter || p.gender === genderFilter) &&
      (!q || `${p.name} ${p.category?.name || ""} ${p.sku || ""}`.toLowerCase().includes(q))
    );
  }, [products, query, genderFilter]);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setError("");
    setShowForm(true);
  };

  useEffect(() => {
    if (new URLSearchParams(location.search).get("new")) openNew();
  }, [location.search]);

  useEffect(() => {
    fetchProducts({ page, limit: 20, search: query, gender: genderFilter }).catch(() => {});
  }, [page, genderFilter]);

  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      name:p.name||"", description:p.description||"", brand:p.brand||"",
      category:p.category?._id||p.category||"", gender:p.gender||"unisex",
      sizes:p.sizes||[], colors:p.colors||[], price:String(p.price??""),
      discountPrice:String(p.discountPrice??""), stock:String(p.stock??""), sku:p.sku||"",
      tags:(p.tags||[]).join(", "), isFeatured:!!p.isFeatured,
      images:p.images||[],
    });
    setError("");
    setShowForm(true);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(false);
  };

  const toggleArray = (key, value) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((x) => x !== value) : [...f[key], value],
    }));

  const uploadImages = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    if (form.images.length + files.length > MAX_IMAGES) {
      return setError(`Maximum ${MAX_IMAGES} images allowed.`);
    }

    const bad = files.find((file) =>
      !["image/jpeg","image/png","image/webp","image/svg+xml"].includes(file.type) ||
      file.size > MAX_FILE_MB * 1024 * 1024
    );
    if (bad) return setError(`Use JPG, PNG, WebP or SVG, max ${MAX_FILE_MB}MB each.`);

    setError("");
    setForm((f) => ({
      ...f,
      images: [
        ...f.images,
        ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
      ],
    }));
  };

  const removeImage = (index) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));

  const save = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.category || !form.gender)
      return setError("Name, price, gender and category are required.");
    if (!form.sizes.length) return setError("Select at least one size.");
    if (!form.colors.length) return setError("Select at least one color.");

    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("description", form.description.trim());
    data.append("brand", form.brand.trim());
    data.append("category", form.category);
    data.append("gender", form.gender);
    data.append("price", String(Number(form.price)));
    data.append("discountPrice", String(form.discountPrice ? Number(form.discountPrice) : 0));
    data.append("stock", String(Number(form.stock || 0)));
    if (form.sku.trim()) data.append("sku", form.sku.trim());
    data.append("sizes", JSON.stringify(form.sizes));
    data.append("colors", JSON.stringify(form.colors));
    data.append("tags", JSON.stringify(form.tags.split(",").map((x) => x.trim()).filter(Boolean)));
    data.append("isFeatured", String(form.isFeatured));

    form.images.forEach((item) => {
      if (typeof item === "string") data.append("images", item);
      else if (item?.file) data.append("images", item.file);
    });

    setSaving(true);
    setError("");

    try {
      if (editingId) await updateProduct(editingId, data);
      else await addProduct(data);
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await deleteProduct(id); }
    catch (err) { alert(err.response?.data?.message || err.message || "Failed to delete product."); }
  };

  return (
    <div className="admin-page">
      <SectionTitle eyebrow="CLOTHING INVENTORY" title="Products" description={`${meta.total || products.length} products in your store.`} action={<button className="admin-primary-btn" onClick={openNew}>＋ ADD PRODUCT</button>} />
      {loadError && <div className="admin-error">{loadError}</div>}

      {showForm && (
        <section className="admin-panel admin-form-panel">
          <div className="admin-panel-head"><div><span className="admin-eyebrow">CLOTHING PRODUCT</span><h3>{editingId ? "Edit Product" : "Add New Product"}</h3></div><button className="admin-close-text" onClick={closeForm}>CANCEL ×</button></div>
          {error && <div className="admin-error">{error}</div>}
          <form onSubmit={save} className="admin-form">
            <div className="admin-form-grid">
              <input className="admin-input" placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              <select className="admin-input" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>{GENDERS.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
              <select className="admin-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="">Select category</option>{categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select>
              <input className="admin-input" placeholder="Brand (optional)" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/>
              <input className="admin-input" type="number" min="0" placeholder="Price (₹)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
              <input className="admin-input" type="number" min="0" placeholder="Discount price (₹)" value={form.discountPrice} onChange={e=>setForm({...form,discountPrice:e.target.value})}/>
              <input className="admin-input" type="number" min="0" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/>
              <input className="admin-input" placeholder="SKU (optional)" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/>
            </div>
            <textarea className="admin-input" placeholder="Product description" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            <div><label className="admin-upload-label">SIZE</label><div className="admin-filter-row">{SIZES.map(s=><button type="button" key={s} className={`admin-filter-chip ${form.sizes.includes(s)?"active":""}`} onClick={()=>toggleArray("sizes",s)}>{s}</button>)}</div></div>
            <div><label className="admin-upload-label">COLOR</label><div className="admin-filter-row">{COLORS.map(c=><button type="button" key={c} className={`admin-filter-chip ${form.colors.includes(c)?"active":""}`} onClick={()=>toggleArray("colors",c)}>{c}</button>)}</div></div>
            <input className="admin-input" placeholder="Tags, comma separated (optional)" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/>
            <label className="admin-checkbox-row"><input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})}/><span>Feature on homepage</span></label>

            <div>
              <label className="admin-upload-label">PRODUCT IMAGES · {form.images.length}/{MAX_IMAGES}</label>
              <div className="admin-photo-grid">
                {form.images.map((image,i) => {
                  const src = typeof image === "string" ? image : image.preview;
                  return <div className="admin-photo" key={`${src}-${i}`}><img src={src} alt=""/><button type="button" onClick={()=>removeImage(i)}>×</button></div>;
                })}
                {form.images.length < MAX_IMAGES && (
                  <label className="admin-photo-add">
                    <span>＋</span><small>ADD IMAGE</small>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple onChange={uploadImages}/>
                  </label>
                )}
              </div>
              <small className="admin-help">JPG, PNG, WebP or SVG · max {MAX_FILE_MB}MB each · backend uploads directly to Cloudinary.</small>
            </div>

            <button className="admin-primary-btn full" disabled={saving}>{saving ? "UPLOADING & SAVING..." : "SAVE PRODUCT"}</button>
          </form>
        </section>
      )}

      <section className="admin-panel">
        <div className="admin-list-head">
          <div><h3>All Products</h3><small>{filtered.length} loaded · {meta.total||0} total</small></div>
          <div className="admin-filter-row">
            <button className={`admin-filter-chip ${!genderFilter?"active":""}`} onClick={()=>{setGenderFilter("");setPage(1)}}>ALL</button>
            {GENDERS.map(([v,l])=><button key={v} className={`admin-filter-chip ${genderFilter===v?"active":""}`} onClick={()=>{setGenderFilter(v);setPage(1)}}>{l.toUpperCase()}</button>)}
          </div>
          <input className="admin-search" placeholder="Search products..." value={query} onChange={e=>setQuery(e.target.value)}/>
        </div>
        <div className="admin-product-list">
          {loading?<div className="admin-empty">Loading products...</div>:filtered.length?filtered.map(p=><article className="admin-product-row" key={p._id}><div className="admin-product-image">{p.images?.[0]?<img loading="lazy" src={p.images[0]} alt=""/>:<span>□</span>}</div><div className="admin-product-info"><strong>{p.name}</strong><small>{p.gender} · {p.category?.name||"Uncategorized"} · Sizes {p.sizes?.join(", ")||"—"} · Stock {p.stock}</small></div><strong className="gold">₹{Number(p.discountPrice||p.price||0).toLocaleString("en-IN")}</strong><div className="admin-row-actions"><button onClick={()=>edit(p)} className="admin-secondary-btn">EDIT</button><button onClick={()=>remove(p._id)} className="admin-danger-btn">DELETE</button></div></article>):<div className="admin-empty">No products found.</div>}
        </div>
        {meta.pages > 1 && <div className="admin-list-head" style={{justifyContent:"flex-end"}}><div className="admin-row-actions"><button className="admin-secondary-btn" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>← PREV</button><small>PAGE {meta.page} / {meta.pages}</small><button className="admin-secondary-btn" disabled={page>=meta.pages} onClick={()=>setPage(p=>Math.min(meta.pages,p+1))}>NEXT →</button></div></div>}
      </section>
    </div>
  );
}
