import { useState } from "react";
import { useCategories } from "../context/CategoriesContext";
import SectionTitle from "../components/SectionTitle";

const emptyForm = { name: "", description: "", image: null, imagePreview: "" };
const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export default function Categories() {
  const { categories, loading, error: loadError, addCategory, updateCategory, deleteCategory } = useCategories();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const edit = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name || "",
      description: category.description || "",
      image: null,
      imagePreview: category.image || "",
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(false);
  };

  const chooseImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!allowed.includes(file.type)) return setError("Use JPG, PNG, WebP or SVG.");
    if (file.size > 5 * 1024 * 1024) return setError("Category image must be smaller than 5MB.");

    setError("");
    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const save = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return setError("Category name is required.");
    if (!editingId && !form.image) return setError("Category image is required.");

    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("description", form.description.trim());
    if (form.image) data.append("image", form.image);

    setSaving(true);
    setError("");

    try {
      if (editingId) await updateCategory(editingId, data);
      else await addCategory(data);
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete category.");
    }
  };

  return (
    <div className="admin-page">
      <SectionTitle
        eyebrow="CLOTHING COLLECTIONS"
        title="Categories"
        description={`${categories.length} categories in your store.`}
        action={<button className="admin-primary-btn" onClick={openNew}>＋ ADD CATEGORY</button>}
      />

      {loadError && <div className="admin-error">{loadError}</div>}

      {showForm && (
        <section className="admin-panel admin-form-panel">
          <div className="admin-panel-head">
            <div><span className="admin-eyebrow">CATEGORY IMAGE</span><h3>{editingId ? "Edit Category" : "Add New Category"}</h3></div>
            <button className="admin-close-text" onClick={closeForm}>CANCEL ×</button>
          </div>

          {error && <div className="admin-error">{error}</div>}

          <form onSubmit={save} className="admin-form">
            <input className="admin-input" placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <textarea className="admin-input" placeholder="Description (optional)" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <div>
              <label className="admin-upload-label">CATEGORY IMAGE</label>
              <div className="admin-category-upload">
                {form.imagePreview && <img src={form.imagePreview} alt="Category preview" loading="lazy" />}
                <label className="admin-photo-add">
                  <span>＋</span>
                  <small>{form.imagePreview ? "CHANGE IMAGE" : "ADD IMAGE"}</small>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={chooseImage} />
                </label>
              </div>
              <small className="admin-help">JPG, PNG, WebP or SVG · max 5MB · uploaded directly to Cloudinary by backend.</small>
            </div>

            <button className="admin-primary-btn full" disabled={saving}>
              {saving ? "UPLOADING & SAVING..." : "SAVE CATEGORY"}
            </button>
          </form>
        </section>
      )}

      <section className="admin-panel">
        {loading ? (
          <div className="admin-empty">Loading categories...</div>
        ) : !categories.length ? (
          <div className="admin-empty">No categories yet.</div>
        ) : (
          <div className="admin-product-list">
            {categories.map((c) => (
              <article className="admin-product-row" key={c._id}>
                <div className="admin-product-image category-thumb">{c.image ? <img loading="lazy" src={c.image} alt={c.name} /> : <span>▤</span>}</div>
                <div className="admin-product-info"><strong>{c.name}</strong><small>{c.description || "Clothing collection"}</small></div>
                <span className="admin-status">{c.isActive ? "ACTIVE" : "HIDDEN"}</span>
                <div className="admin-row-actions">
                  <button onClick={() => edit(c)} className="admin-secondary-btn">EDIT</button>
                  <button onClick={() => remove(c._id)} className="admin-danger-btn">DELETE</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
