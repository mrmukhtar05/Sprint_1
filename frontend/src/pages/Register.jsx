import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await register(form);

      if (!result.success) {
        setError(result.error);
        return;
      }

      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-5 py-20">
      <h1 className="text-5xl font-black">REGISTER</h1>

      {error && (
        <p className="mt-4 border border-[var(--red)] bg-[var(--red)]/10 px-4 py-3 text-sm text-[var(--red)]">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="bg-[var(--surface)] p-4 outline-none"
          placeholder="Full Name"
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="bg-[var(--surface)] p-4 outline-none"
          placeholder="Email"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="bg-[var(--surface)] p-4 outline-none"
          placeholder="Password"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--gold)] p-4 font-black text-black hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--muted)]">
        Already registered?{" "}
        <Link className="text-[var(--gold)]" to="/login">
          Login
        </Link>
      </p>
    </main>
  );
}