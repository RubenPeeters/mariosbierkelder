"use client";
import { useOrders } from "@/hooks/useOrders";
import { useTranslation } from "@/providers/language";

export default function EveningSummary() {
  const { t } = useTranslation();
  const { orders } = useOrders("confirmed", 30000);

  if (orders.length === 0) return null;

  const counts: Record<string, number> = {};
  for (const o of orders) counts[o.beer_name] = (counts[o.beer_name] || 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topBeer = sorted[0];

  return (
    <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <h2 className="text-sm font-bold text-gray-500 mb-2">{t("tonight")}</h2>
      <div className="flex gap-6 text-sm">
        <div><span className="font-bold text-lg">{orders.length}</span> {t("beersServed")}</div>
        {topBeer && <div>{t("mostPopular")}: <span className="font-bold">{topBeer[0]}</span> ({topBeer[1]}×)</div>}
      </div>
      {sorted.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {sorted.map(([name, count]) => (
            <span key={name} className="text-xs bg-white px-2 py-1 rounded-full">{name} ×{count}</span>
          ))}
        </div>
      )}
    </div>
  );
}
