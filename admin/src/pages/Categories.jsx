import { useState } from "react";
import { useCategories } from "../context/CategoriesContext";
import SectionTitle from "../components/SectionTitle";

const emptyForm = { name: "", description: "", image: "" };

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
      image: category.image || "",
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

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId !== null) await updateCategory(editingId, form);
      else await addCategory(form);
      closeForm();
    } catch (err) {
      setError(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category? Products using it will keep an invalid reference.")) return;
    try {
      await deleteCategory(id);
    } catch (err) {
      alert(err.message || "Failed to delete category.");
    }
  };

  return (
    <div className="admin-page">
      <SectionTitle
        eyebrow="INVENTORY"
        title="Categories"
        description={`${categories.length} categories in your store.`}
        action={<button className="admin-primary-btn" onClick={openNew}>＋ ADD CATEGORY</button>}
      />

      {loadError && <div className="admin-error">{loadError}</div>}

      {showForm && (
        <section className="admin-panel admin-form-panel">
          <div className="admin-panel-head">
            <div><span className="admin-eyebrow">CATEGORY</span><h3>{editingId !== null ? "Edit Category" : "Add New Category"}</h3></div>
            <button className="admin-close-text" onClick={closeForm}>CANCEL ×</button>
          </div>

          {error && <div className="admin-error">{error}</div>}

          <form onSubmit={save} className="admin-form">
            <div className="admin-form-grid">
              <input className="admin-input" placeholder="Category name" value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} />
              <input className="admin-input" placeholder="Image URL (optional)" value={form.image} onChange={(e) => setForm({...form, image:e.target.value})} />
            </div>
            <textarea
              className="admin-input"
              placeholder="Description (optional)"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({...form, description:e.target.value})}
            />
            <button className="admin-primary-btn full" disabled={saving}>
              {saving ? "SAVING..." : "SAVE CATEGORY"}
            </button>
          </form>
        </section>
      )}

      <section className="admin-panel">
        {loading ? (
          <div className="admin-empty">Loading categories...</div>
        ) : !categories.length ? (
          <div className="admin-empty">No categories yet. Add your first one above.</div>
        ) : (
          <div className="admin-product-list">
            {categories.map((cat) => (
              <article className="admin-product-row" key={cat._id}>
                <div className="admin-product-image">
                  {cat.image ? <img src={cat.image} alt="" /> : <span>▤</span>}
                </div>
                <div className="admin-product-info">
                  <strong>{cat.name}</strong>
                  <small>{cat.description || "No description"}</small>
                </div>
                <span className="admin-status">{cat.isActive ? "ACTIVE" : "HIDDEN"}</span>
                <div className="admin-row-actions">
                  <button onClick={() => edit(cat)} className="admin-secondary-btn">EDIT</button>
                  <button onClick={() => remove(cat._id)} className="admin-danger-btn">DELETE</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
