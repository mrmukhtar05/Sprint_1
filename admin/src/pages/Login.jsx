import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@vintagevault.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result?.user?.role !== "admin") throw new Error("This account is not an admin account.");
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#080a0d] px-4 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101419] p-7 shadow-2xl shadow-black/40 sm:p-9">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-black tracking-[5px] text-amber-400">VINTAGE VAULT</p>
          <h1 className="mt-2 text-3xl font-black">ADMIN LOGIN</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage your store.</p>
        </div>

        {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-[10px] font-black tracking-[2px] text-slate-400">EMAIL</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="username" className="w-full rounded-lg border border-white/10 bg-[#080a0d] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-amber-400" placeholder="admin@example.com" />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] font-black tracking-[2px] text-slate-400">PASSWORD</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password" className="w-full rounded-lg border border-white/10 bg-[#080a0d] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-amber-400" placeholder="••••••••" />
          </label>

          <button disabled={loading} type="submit" className="w-full rounded-lg bg-amber-400 px-4 py-3.5 text-sm font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "SIGNING IN..." : "SIGN IN TO ADMIN"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-white/5 bg-black/20 p-3 text-center text-[10px] text-slate-500">
          Backend API: <span className="text-slate-300">{import.meta.env.VITE_API_URL || "http://localhost:5000/api"}</span>
        </div>
      </div>
    </main>
  );
}
