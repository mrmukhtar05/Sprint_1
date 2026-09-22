import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

    if (!form.email || !form.password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);

      const result = await login(form);

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
      <h1 className="text-5xl font-black">LOGIN</h1>

      {error && (
        <p className="mt-4 border border-[var(--red)] bg-[var(--red)]/10 px-4 py-3 text-sm text-[var(--red)]">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
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
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--muted)]">
        New here?{" "}
        <Link className="text-[var(--gold)]" to="/register">
          Create account
        </Link>
      </p>
    </main>
  );
}