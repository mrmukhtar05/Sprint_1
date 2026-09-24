import { createContext, useContext, useState } from "react";
import api from "../api/api";
const OrdersContext = createContext(null);
export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const placeOrder = async ({ items, shippingAddress, paymentMethod = "COD" }) => {
    const orderItems = items.map(i => ({ product: i._id, quantity: Number(i.qty || 1), size: i.size || "One Size", color: i.color || "Default" }));
    const r = await api.post("/orders", { orderItems, shippingAddress, paymentMethod });
    const order = r.data.order;
    if (paymentMethod === "RAZORPAY") return { ...r.data, order };
    setOrders(p => [order, ...p]);
    return { ...r.data, order };
  };
  const verifyRazorpay = async (payload) => {
    const r = await api.post("/orders/razorpay/verify", payload);
    setOrders(p => [r.data.order, ...p.filter(o => o._id !== r.data.order._id)]);
    return r.data.order;
  };
  const fetchMyOrders = async () => { const r = await api.get("/orders/my"); setOrders(r.data.orders || []); return r.data.orders || []; };
  const getOrder = async (id) => { const r = await api.get(`/orders/${id}`); return r.data.order; };
  const cancelOrder = async (id) => { const r = await api.put(`/orders/${id}/cancel`); setOrders(p => p.map(o => o._id === id ? r.data.order : o)); return r.data.order; };
  return <OrdersContext.Provider value={{ orders, placeOrder, verifyRazorpay, fetchMyOrders, getOrder, cancelOrder }}>{children}</OrdersContext.Provider>;
}
export function useOrders() { const ctx = useContext(OrdersContext); if (!ctx) throw new Error("useOrders must be used inside OrdersProvider"); return ctx; }
