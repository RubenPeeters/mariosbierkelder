"use client";
import { useOrders } from "@/hooks/useOrders";
import { useTranslation } from "@/providers/language";

export default function OrderFeed() {
  const { t } = useTranslation();
  const { orders } = useOrders("confirmed", 10000);

  if (orders.length === 0) return null;

  return (
    <div className="w-full mt-8 p-4 bg-white/80 rounded-xl shadow-sm">
      <h2 className="text-sm font-bold text-gray-500 mb-3">{t("recentOrders")}</h2>
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {orders.slice(0, 20).map((order) => (
          <div key={order.id} className="flex justify-between text-sm">
            <span>{order.beer_name}</span>
            <span className="text-gray-400">
              {new Date(order.created_at + "Z").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
