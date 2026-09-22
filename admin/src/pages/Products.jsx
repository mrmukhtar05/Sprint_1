import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import SectionTitle from "../components/SectionTitle";

const CONDITIONS = ["new", "like-new", "good", "fair"];
const MAX_IMAGES = 6;
const MAX_FILE_MB = 2;

const emptyForm = {
  name: "",
  description: "",
  brand: "",
  category: "",
  price: "",
  discountPrice: "",
  stock: "",
  sku: "",
  condition: "good",
  era: "",
  tags: "",
  isFeatured: false,
  images: [],
};

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function Products() {
  const { products, loading, error: loadError, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      `${p.name} ${p.category?.name || ""} ${p.sku || ""}`.toLowerCase().includes(q)
    );
  }, [products, query]);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setError("");
    setShowForm(true);
  };

  useEffect(() => {
    const wantsNew = new URLSearchParams(location.search).get("new");
    if (wantsNew) openNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const edit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      brand: product.brand || "",
      category: product.category?._id || product.category || "",
      price: String(product.price ?? ""),
      discountPrice: String(product.discountPrice ?? ""),
      stock: String(product.stock ?? ""),
      sku: product.sku || "",
      condition: product.condition || "good",
      era: product.era || "",
      tags: (product.tags || []).join(", "),
      isFeatured: !!product.isFeatured,
      images: product.images || [],
    });
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      alert(err.message || "Failed to delete product.");
    }
  };

  const uploadImages = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (form.images.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} photos allowed.`);
      return;
    }

    const oversized = files.find((file) => file.size > MAX_FILE_MB * 1024 * 1024);
    if (oversized) {
      setError(`Each image must be smaller than ${MAX_FILE_MB}MB.`);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const images = await Promise.all(files.map(readFile));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...images] }));
    } catch {
      setError("Could not read the selected image.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.price || !form.category) {
      setError("Name, price and category are required.");
      return;
    }
    if (!form.images.length) {
      setError("Add at least one product photo.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
      stock: form.stock ? Number(form.stock) : 0,
      sku: form.sku.trim() || undefined,
      condition: form.condition,
      era: form.era.trim(),
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      isFeatured: form.isFeatured,
      images: form.images,
    };

    setSaving(true);
    setError("");

    try {
      if (editingId !== null) await updateProduct(editingId, payload);
      else await addProduct(payload);
      closeForm();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(false);
  };

  return (
    <div className="admin-page">
      <SectionTitle
        eyebrow="INVENTORY"
        title="Products"
        description={`${products.length} products currently available in your store.`}
        action={<button className="admin-primary-btn" onClick={openNew}>＋ ADD PRODUCT</button>}
      />

      {loadError && <div className="admin-error">{loadError}</div>}

      {showForm && (
        <section className="admin-panel admin-form-panel">
          <div className="admin-panel-head">
            <div><span className="admin-eyebrow">PRODUCT</span><h3>{editingId !== null ? "Edit Product" : "Add New Product"}</h3></div>
            <button className="admin-close-text" onClick={closeForm}>CANCEL ×</button>
          </div>

          {error && <div className="admin-error">{error}</div>}

          <form onSubmit={save} className="admin-form">
            <div className="admin-form-grid">
              <input className="admin-input" placeholder="Product name" value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} />
              <select className="admin-input" value={form.category} onChange={(e) => setForm({...form, category:e.target.value})}>
                <option value="" disabled>Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input className="admin-input" placeholder="Brand (optional)" value={form.brand} onChange={(e) => setForm({...form, brand:e.target.value})} />
              <input className="admin-input" type="number" min="0" placeholder="Selling price (₹)" value={form.price} onChange={(e) => setForm({...form, price:e.target.value})} />
              <input className="admin-input" type="number" min="0" placeholder="Discount price (₹, optional)" value={form.discountPrice} onChange={(e) => setForm({...form, discountPrice:e.target.value})} />
              <input className="admin-input" type="number" min="0" placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({...form, stock:e.target.value})} />
              <select className="admin-input" value={form.condition} onChange={(e) => setForm({...form, condition:e.target.value})}>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="admin-input" placeholder="Era (e.g. 1990s, optional)" value={form.era} onChange={(e) => setForm({...form, era:e.target.value})} />
              <input className="admin-input" placeholder="SKU (optional)" value={form.sku} onChange={(e) => setForm({...form, sku:e.target.value})} />
              <input className="admin-input" placeholder="Tags, comma separated" value={form.tags} onChange={(e) => setForm({...form, tags:e.target.value})} />
            </div>

            <textarea
              className="admin-input"
              placeholder="Product description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({...form, description:e.target.value})}
            />

            <label className="admin-checkbox-row">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({...form, isFeatured:e.target.checked})}
              />
              <span>Feature this product on the homepage</span>
            </label>

            <div>
              <label className="admin-upload-label">PRODUCT PHOTOS · {form.images.length}/{MAX_IMAGES}</label>
              <div className="admin-photo-grid">
                {form.images.map((image, index) => (
                  <div className="admin-photo" key={`${image}-${index}`}>
                    <img src={image} alt="" />
                    <button type="button" onClick={() => setForm(f => ({...f, images:f.images.filter((_,i)=>i!==index)}))}>×</button>
                  </div>
                ))}
                {form.images.length < MAX_IMAGES && (
                  <label className="admin-photo-add">
                    <span>＋</span><small>{uploading ? "READING..." : "ADD PHOTO"}</small>
                    <input type="file" accept="image/*" multiple onChange={uploadImages} disabled={uploading} />
                  </label>
                )}
              </div>
              <small className="admin-help">Up to {MAX_IMAGES} images, {MAX_FILE_MB}MB each.</small>
            </div>

            <button className="admin-primary-btn full" disabled={saving}>
              {saving ? "SAVING..." : "SAVE PRODUCT"}
            </button>
          </form>
        </section>
      )}

      <section className="admin-panel">
        <div className="admin-list-head">
          <div><h3>All Products</h3><small>{filtered.length} results</small></div>
          <input className="admin-search" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="admin-product-list">
          {loading ? (
            <div className="admin-empty">Loading products...</div>
          ) : (
            <>
              {filtered.map((product) => (
                <article className="admin-product-row" key={product._id}>
                  <div className="admin-product-image">
                    {product.images?.[0] ? <img src={product.images[0]} alt="" /> : <span>□</span>}
                  </div>
                  <div className="admin-product-info">
                    <strong>{product.name}</strong>
                    <small>{product.category?.name || "Uncategorized"} · Stock {product.stock} · {product.condition}</small>
                  </div>
                  <strong className="gold">₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
                  <div className="admin-row-actions">
                    <button onClick={() => edit(product)} className="admin-secondary-btn">EDIT</button>
                    <button onClick={() => remove(product._id)} className="admin-danger-btn">DELETE</button>
                  </div>
                </article>
              ))}
              {!filtered.length && <div className="admin-empty">No products found.</div>}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
