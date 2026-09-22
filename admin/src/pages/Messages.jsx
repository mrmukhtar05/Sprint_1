import { useEffect, useState } from "react";
import api from "../api/api";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/messages");
      setMessages(res.data?.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (item) => {
    try {
      await api.put(`/admin/messages/${item._id}`, { isRead: !item.isRead });
      setMessages((prev) => prev.map((m) => m._id === item._id ? { ...m, isRead: !item.isRead } : m));
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) { console.error(err); }
  };

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-black tracking-[3px] text-amber-400">CUSTOMER COMMUNICATION</p>
          <h2 className="mt-2 text-3xl font-black">Messages</h2>
          <p className="mt-1 text-sm text-slate-500">Contact form enquiries from your storefront.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[.03] px-5 py-3 text-sm font-bold">{unread} unread</div>
      </div>

      {loading ? <div className="rounded-2xl border border-white/10 p-10 text-center text-slate-500">Loading messages...</div> : messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-14 text-center"><p className="text-4xl">✉</p><h3 className="mt-4 text-xl font-black">No messages yet</h3><p className="mt-2 text-sm text-slate-500">Customer enquiries will appear here.</p></div>
      ) : (
        <div className="space-y-3">
          {messages.map((item) => (
            <article key={item._id} className={`rounded-2xl border p-5 transition ${item.isRead ? "border-white/10 bg-white/[.02]" : "border-amber-400/30 bg-amber-400/[.04]"}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black">{item.subject}</h3>
                    {!item.isRead && <span className="rounded-full bg-amber-400 px-2 py-1 text-[9px] font-black text-black">NEW</span>}
                  </div>
                  <p className="mt-1 text-xs text-amber-400">{item.name} · {item.email}</p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{item.message}</p>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => markRead(item)} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold hover:border-amber-400 hover:text-amber-400">{item.isRead ? "Unread" : "Mark read"}</button>
                  <button onClick={() => remove(item._id)} className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
