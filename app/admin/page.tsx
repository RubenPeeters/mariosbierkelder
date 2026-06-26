"use client";
import Loading from "@/components/loading";
import PageShell from "@/components/page-shell";
import ImageUpload from "@/components/image-upload";
import { useBeers } from "@/hooks/useBeers";
import { useOrders } from "@/hooks/useOrders";
import { Beer, BeerColorArray, BeerTypeArray } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus, Trash2, X } from "lucide-react";
import { truncateText } from "@/lib/utils";

export default function Admin() {
  const { loading, beers, getBeers } = useBeers();
  const { orders: pendingOrders, refresh: refreshOrders } = useOrders("pending", 5000);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    count: 0,
    color: BeerColorArray[0],
    percentage: 0,
    type: BeerTypeArray[0],
    imageUrl: "",
  });

  useEffect(() => {
    getBeers();
  }, []);

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
    setForm({ name: "", count: 0, color: BeerColorArray[0], percentage: 0, type: BeerTypeArray[0], imageUrl: "" });
    setAdding(false);
    getBeers();
  };

  return (
    <PageShell title="ADMIN">
      {pendingOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 mb-3">Pending Orders ({pendingOrders.length})</h2>
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
        <a href="/qr" className="text-sm text-amber-600 hover:text-amber-700 font-medium">Show QR</a>
        <Button onClick={() => setAdding(!adding)}>
          {adding ? "Cancel" : "+ Add Beer"}
        </Button>
      </div>

      {adding && (
        <form onSubmit={addBeer} className="grid grid-cols-2 gap-3 mb-8 p-4 border rounded-xl bg-white shadow-sm">
          <input className="border rounded px-3 py-2 col-span-2" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded px-3 py-2" type="number" placeholder="Count" min={0} value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} />
          <input className="border rounded px-3 py-2" type="number" step="0.1" placeholder="ABV %" min={0} value={form.percentage} onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })} />
          <select className="border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {BeerTypeArray.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="border rounded px-3 py-2" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
            {BeerColorArray.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <Button type="submit" className="col-span-2">Save</Button>
        </form>
      )}

      {loading && <Loading />}
      {!loading && (
        <div className="flex flex-col gap-2">
          {beers.map((beer: Beer) => (
            <div key={beer.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{truncateText(beer.name, 24)}</p>
                <p className="text-xs text-gray-400">{beer.type} · {beer.percentage}% ABV</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 mr-1">Stock:</span>
                <Button variant="outline" size="icon" onClick={() => setCount(beer, beer.count - 1)} disabled={beer.count === 0}>
                  <Minus className="w-4 h-4" />
                </Button>
                <input
                  type="number"
                  className="w-14 text-center font-bold border rounded py-1"
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
            <div className="text-center py-12 text-gray-400">No beers yet. Add one above.</div>
          )}
        </div>
      )}
    </PageShell>
  );
}
