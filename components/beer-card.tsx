"use client";
import { Beer } from "@/types";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BeerIcon from "./beer-icon";
import BeerDetail from "./beer-detail";
import Toast from "./ui/toast";
import { truncateText } from "@/lib/utils";
import { useTranslation } from "@/providers/language";

export default function BeerCard({ beer, showOrder = false }: { beer: Beer; showOrder?: boolean }) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [avg, setAvg] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/ratings?beerId=${beer.id}`).then(r => r.json()).then(d => setAvg(d.avg));
  }, [beer.id, showDetail]);

  const order = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`${t("order")} ${beer.name}?`)) return;
    setPending(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beerId: beer.id }),
    });
    if (res.ok) {
      const { id } = await res.json();
      setOrderId(id);
      setShowToast(true);
    }
    setPending(false);
  };

  const undo = async () => {
    if (!orderId) return;
    await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    setOrderId(null);
    setShowToast(false);
  };

  const dismissToast = useCallback(() => setShowToast(false), []);

  return (
    <>
      <Card
        className="flex flex-col justify-center items-center text-center w-full sm:w-[300px] h-[350px] sm:h-[400px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowDetail(true)}
      >
        <CardHeader className="py-8 sm:py-12">
          <CardTitle className="flex flex-col gap-4 sm:gap-6 items-center justify-center">
            {beer.imageUrl ? (
              <Image className="object-contain w-48 h-36 sm:w-64 sm:h-48 rounded-lg" src={beer.imageUrl} alt="" width={1000} height={1000} />
            ) : (
              <BeerIcon />
            )}
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex justify-center gap-2 items-end align-baseline">
                <p className="text-xl">{truncateText(beer.name, 18)}</p>
                <span className="text-xs text-gray-400">{beer.percentage}%</span>
              </div>
              {avg !== null && (
                <span className="text-xs text-amber-500">{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</span>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex w-full justify-between">
          {showOrder ? (
            orderId ? (
              <button onClick={(e) => { e.stopPropagation(); undo(); }} className="flex items-center justify-center min-h-[44px] px-6 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600">
                {t("undo")}
              </button>
            ) : (
              <button onClick={order} disabled={pending} className="flex items-center justify-center min-h-[44px] px-6 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 disabled:opacity-50">
                {pending ? "..." : t("order")}
              </button>
            )
          ) : beer.count > 0 ? (
            <div className="flex items-center justify-center h-10 w-18 bg-green-100 px-6 rounded-lg text-center font-bold text-green-500 text-xl">✓</div>
          ) : (
            <div className="flex items-center justify-center h-10 w-18 bg-red-100 px-6 rounded-lg text-center font-bold text-red-500 text-xl">✘</div>
          )}
          <div className="flex items-center justify-center min-h-[44px] w-18 border-2 border-amber-600 px-6 rounded-lg text-center font-bold">
            {beer.count}
          </div>
        </CardFooter>
      </Card>
      {showDetail && <BeerDetail beer={beer} onClose={() => setShowDetail(false)} />}
      {showToast && (
        <Toast message={`${beer.name} ${t("ordered")}`} onUndo={undo} onDismiss={dismissToast} />
      )}
    </>
  );
}
