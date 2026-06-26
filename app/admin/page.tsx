"use client";
import Loading from "@/components/loading";
import PageShell from "@/components/page-shell";
import ImageUpload from "@/components/image-upload";
import EveningSummary from "@/components/evening-summary";
import { useBeers } from "@/hooks/useBeers";
import { useOrders } from "@/hooks/useOrders";
import { Beer, BeerColorArray, BeerTypeArray, CategoryArray } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Minus, Plus, Trash2, X } from "lucide-react";
import { truncateText } from "@/lib/utils";
import { useTranslation } from "@/providers/language";

const LOW_STOCK_THRESHOLD = 2;

export default function Admin() {
  const { t } = useTranslation();
  const { loading, beers, getBeers } = useBeers();
  const { orders: pendingOrders, refresh: refreshOrders } = useOrders("pending", 5000);
  const prevOrderCount = useRef(0);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    count: 0,
    category: "beer" as string,
    color: BeerColorArray[0] as string,
    percentage: 0,
    type: BeerTypeArray[0] as string,
    imageUrl: "",
    description: "",
    brewery: "",
    country: "",
    ibu: 0,
  });

  useEffect(() => {
    getBeers();
  }, []);

  // ponytail: sound + vibration when new orders come in
  useEffect(() => {
    if (pendingOrders.length > prevOrderCount.current && prevOrderCount.current > 0) {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain).connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        navigator.vibrate?.(200);
      } catch {}
    }
    prevOrderCount.current = pendingOrders.length;
  }, [pendingOrders.length]);

  const resolveOrder = async (orderId: string, status: "confirmed" | "rejected") => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refreshOrders();
    if (status === "confirmed") getBeers();
  };

  const setCount = async (beer: Beer, newCount: number) => {
    await fetch(`/api/beers/${beer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: Math.max(0, newCount) }),
    });
    getBeers();
  };

  const deleteBeer = async (id: string) => {
    await fetch(`/api/beers/${id}`, { method: "DELETE" });
    getBeers();
  };

  const addBeer = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/beers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", count: 0, category: "beer", color: BeerColorArray[0], percentage: 0, type: BeerTypeArray[0], imageUrl: "", description: "", brewery: "", country: "", ibu: 0 });
    setAdding(false);
    getBeers();
  };

  return (
    <PageShell title="ADMIN">
      <EveningSummary />

      {pendingOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 mb-3">{t("pendingOrders")} ({pendingOrders.length})</h2>
          <div className="flex flex-col gap-2">
            {pendingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div>
                  <p className="font-semibold">{order.beer_name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at + "Z").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" onClick={() => resolveOrder(order.id, "confirmed")} className="bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => resolveOrder(order.id, "rejected")}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <a href="/qr" className="text-sm text-amber-600 hover:text-amber-700 font-medium">{t("showQR")}</a>
        <Button onClick={() => setAdding(!adding)}>
          {adding ? t("cancel") : t("addBeer")}
        </Button>
      </div>

      {adding && (
        <form onSubmit={addBeer} className="grid grid-cols-2 gap-3 mb-8 p-4 border rounded-xl bg-white shadow-sm">
          <input className="border rounded px-3 py-2 col-span-2" placeholder={t("name")} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{t("category")}</span>
            <select className="border rounded px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CategoryArray.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{t("count")}</span>
            <input className="border rounded px-3 py-2" type="number" min={0} value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{t("abv")}</span>
            <input className="border rounded px-3 py-2" type="number" step="0.1" min={0} value={form.percentage} onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })} />
          </label>
          {form.category === "beer" && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">IBU</span>
              <input className="border rounded px-3 py-2" type="number" min={0} value={form.ibu} onChange={(e) => setForm({ ...form, ibu: Number(e.target.value) })} />
            </label>
          )}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{t("type")}</span>
            <select className="border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {BeerTypeArray.map((bt) => <option key={bt} value={bt}>{bt.charAt(0).toUpperCase() + bt.slice(1)}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{t("color")}</span>
            <select className="border rounded px-3 py-2" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
              {BeerColorArray.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </label>
          <input className="border rounded px-3 py-2" placeholder={t("brewery")} value={form.brewery} onChange={(e) => setForm({ ...form, brewery: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder={t("country")} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <textarea className="border rounded px-3 py-2 col-span-2" placeholder={t("description")} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <Button type="submit" className="col-span-2">{t("save")}</Button>
        </form>
      )}

      {loading && <Loading />}
      {!loading && (
        <div className="flex flex-col gap-2">
          {beers.map((beer: Beer) => (
            <div key={beer.id} className={`flex items-center justify-between p-4 rounded-xl shadow-sm ${
              beer.count === 0 ? "bg-red-50 border border-red-200" :
              beer.count <= LOW_STOCK_THRESHOLD ? "bg-amber-50 border border-amber-200" :
              "bg-white"
            }`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{truncateText(beer.name, 24)}</p>
                  {beer.count > 0 && beer.count <= LOW_STOCK_THRESHOLD && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </div>
                <p className="text-xs text-gray-400">{beer.type} · {beer.percentage}% ABV</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 mr-1">{t("stock")}</span>
                <Button variant="outline" size="icon" onClick={() => setCount(beer, beer.count - 1)} disabled={beer.count === 0}>
                  <Minus className="w-4 h-4" />
                </Button>
                <input
                  type="number"
                  className="w-14 text-center font-bold border rounded py-1 bg-transparent"
                  value={beer.count}
                  min={0}
                  onChange={(e) => setCount(beer, Number(e.target.value))}
                />
                <Button variant="outline" size="icon" onClick={() => setCount(beer, beer.count + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => deleteBeer(beer.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {beers.length === 0 && (
            <div className="text-center py-12 text-gray-400">{t("noBeersAdmin")}</div>
          )}
        </div>
      )}
    </PageShell>
  );
}
