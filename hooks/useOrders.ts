import { Order } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useOrders(status?: string, pollInterval?: number) {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = useCallback(async () => {
    const url = status ? `/api/orders?status=${status}` : "/api/orders";
    const res = await fetch(url);
    if (res.ok) setOrders(await res.json());
  }, [status]);

  useEffect(() => {
    fetchOrders();
    if (!pollInterval) return;
    const id = setInterval(fetchOrders, pollInterval);
    return () => clearInterval(id);
  }, [fetchOrders, pollInterval]);

  return { orders, refresh: fetchOrders };
}
