import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import SectionTitle from "../components/SectionTitle";
const money = n => `₹${Number(n || 0).toLocaleString("en-IN")}`;
export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [method, setMethod] = useState("all");
    const [status, setStatus] = useState("all");
    const load = async () => {
        try {
            setLoading(true); setError("");
            const r = await api.get("/admin/payments", { params: { ...(method !== "all" ? { method } : {}), ...(status !== "all" ? { status } : {}), limit: 100 } }); setPayments(r.data.payments || []); setSummary(r.data.summary || []);
        } catch (e) { setError(e.response?.data?.message || "Failed to load payments"); } finally { setLoading(false) }
    }; useEffect(() => { load() }, [method, status]); const totals = useMemo(() => summary.reduce((a, x) => ({ count: a.count + x.count, total: a.total + x.totalAmount, paid: a.paid + x.paidAmount }), { count: 0, total: 0, paid: 0 }), [summary]);
    return <div className="admin-page">
        <SectionTitle eyebrow="FINANCE" title="Payments" description="Track COD and Razorpay payments from customer orders." />
        <div className="admin-filter-row">
            {["all", "COD", "RAZORPAY"].map((x) => (
                <button
                    key={x}
                    className={`admin-filter-chip ${method === x ? "active hover:!text-white" : ""
                        }`}
                    onClick={() => setMethod(x)}
                >
                    {x}
                </button>
            ))}

            <span className="mx-2 text-slate-600">|</span>

            {["all", "paid", "unpaid"].map((x) => (
                <button
                    key={x}
                    className={`admin-filter-chip ${status === x ? "active hover:!text-white" : ""
                        }`}
                    onClick={() => setStatus(x)}
                >
                    {x.toUpperCase()}
                </button>
            ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mb-6"><div className="admin-panel p-5"><p className="text-xs text-slate-500">TRANSACTIONS</p>
            <p className="mt-2 text-2xl font-black">{totals.count}</p>
        </div>
            <div className="admin-panel p-5">
                <p className="text-xs text-slate-500">ORDER VALUE</p>
                <p className="mt-2 text-2xl font-black">{money(totals.total)}</p>
            </div>
            <div className="admin-panel p-5">
                <p className="text-xs text-slate-500">PAID VALUE</p>
                <p className="mt-2 text-2xl font-black text-amber-400">{money(totals.paid)}</p>
            </div>
        </div>
        <section className="admin-panel overflow-x-auto">{error && <div className="admin-error">{error}</div>}{loading ? <div className="admin-empty">Loading payments...</div> : !payments.length ? <div className="admin-empty">No payment records found.</div> : <table className="w-full min-w-[1000px] text-left"><thead><tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-500"><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Method</th><th className="p-4">Status</th><th className="p-4">Amount</th><th className="p-4">Razorpay ID</th><th className="p-4">Order Date</th><th className="p-4">Delivery</th></tr></thead><tbody>{payments.map(p => <tr key={p._id} className="border-b border-white/5 align-top"><td className="p-4 font-bold">#{p._id}</td><td className="p-4"><div className="font-bold">{p.user?.name || "—"}</div><div className="text-xs text-slate-500">{p.user?.email || "—"}</div></td><td className="p-4">{p.paymentMethod === "RAZORPAY" ? "Razorpay / Online" : "COD"}</td><td className="p-4"><span className={`rounded px-2 py-1 text-xs font-bold ${p.isPaid ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{p.isPaid ? "PAID" : "UNPAID"}</span></td><td className="p-4 font-black">{money(p.totalPrice)}</td><td className="p-4 text-xs text-slate-400">{p.razorpayPaymentId || "—"}</td><td className="p-4 text-xs">{new Date(p.createdAt).toLocaleString("en-IN")}</td><td className="p-4 text-xs">{p.status}{p.deliveredAt ? ` · ${new Date(p.deliveredAt).toLocaleDateString("en-IN")}` : ""}</td></tr>)}</tbody></table>}</section>
    </div>
}
