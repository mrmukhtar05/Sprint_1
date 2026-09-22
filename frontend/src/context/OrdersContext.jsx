import { createContext, useContext, useState } from "react";
import api from "../api/api";
const OrdersContext = createContext(null);
export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const placeOrder = async ({ items, shippingAddress, paymentMethod = "COD" }) => {
    const orderItems = items.map(i => ({ product: i._id, quantity: Number(i.qty || 1) }));
    const r = await api.post("/orders", { orderItems, shippingAddress, paymentMethod });
    const order = r.data.order;
    setOrders(p => [order, ...p]);
    return order;
  };
  const fetchMyOrders = async () => { const r = await api.get("/orders/my"); setOrders(r.data.orders || []); return r.data.orders || []; };
  return <OrdersContext.Provider value={{ orders, placeOrder, fetchMyOrders }}>{children}</OrdersContext.Provider>;
}
export function useOrders() { const ctx = useContext(OrdersContext); if (!ctx) throw new Error("useOrders must be used inside OrdersProvider"); return ctx; }
