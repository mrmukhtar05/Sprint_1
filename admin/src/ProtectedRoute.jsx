import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#080a0d] text-slate-100">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-amber-400" />
          <p className="mt-4 text-xs font-bold tracking-widest text-slate-500">CHECKING SESSION</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#080a0d] px-4 text-slate-100">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101419] p-8 text-center">
          <p className="text-[10px] font-black tracking-[4px] text-amber-400">VINTAGE VAULT</p>
          <h1 className="mt-2 text-3xl font-black">ADMIN LOGIN REQUIRED</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">Please login with your admin account to access the control panel.</p>
          <Link to="/login" className="mt-6 inline-flex rounded-lg bg-amber-400 px-5 py-3 text-xs font-black text-black no-underline hover:bg-amber-300">LOGIN</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#080a0d] px-4 text-slate-100">
        <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-[#101419] p-8 text-center">
          <p className="text-[10px] font-black tracking-[4px] text-red-400">ACCESS CONTROL</p>
          <h1 className="mt-2 text-3xl font-black">ACCESS DENIED</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">Your account does not have admin permissions.</p>
          <a href={import.meta.env.VITE_STORE_URL || "http://localhost:5173"} className="mt-6 inline-flex rounded-lg border border-white/10 px-5 py-3 text-xs font-black text-slate-200 no-underline hover:border-amber-400 hover:text-amber-400">GO TO STORE</a>
        </div>
      </div>
    );
  }

  return children;
}
