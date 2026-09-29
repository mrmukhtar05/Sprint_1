// Single source of truth for order-status colours.
// Used by Dashboard (badge + bar), Orders (filters), OrderTable and Payments.

export const STATUS_KEYS = ["pending", "processing", "shipped", "delivered", "cancelled"];

export const STATUS_STYLES = {
  pending: {
    icon: "●",
    badge: "border-orange-500/30 bg-orange-500/15 text-orange-400",
    bar: "bg-orange-400",
    active: "border-orange-400 bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.25)]",
  },
  processing: {
    icon: "◌",
    badge: "border-sky-500/30 bg-sky-500/15 text-sky-400",
    bar: "bg-sky-400",
    active: "border-sky-400 bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.25)]",
  },
  shipped: {
    icon: "➜",
    badge: "border-violet-500/30 bg-violet-500/15 text-violet-400",
    bar: "bg-violet-400",
    active: "border-violet-400 bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]",
  },
  delivered: {
    icon: "✓",
    badge: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
    bar: "bg-emerald-400",
    active: "border-emerald-400 bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]",
  },
  cancelled: {
    icon: "×",
    badge: "border-red-500/30 bg-red-500/15 text-red-400",
    bar: "bg-red-400",
    active: "border-red-500 bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.25)]",
  },
};

export const ALL_FILTER_STYLE = {
  icon: "◉",
  active:
    "border-[var(--admin-gold)] bg-[var(--admin-gold)] text-black shadow-[0_0_20px_rgba(227,170,32,0.22)]",
};

export const NEUTRAL_BADGE = "border-white/10 bg-white/5 text-slate-300";

export const statusBadge = (status) =>
  STATUS_STYLES[String(status || "pending").toLowerCase()]?.badge || NEUTRAL_BADGE;
