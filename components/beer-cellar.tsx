"use client";
import { Beer, BeerTypeArray } from "@/types";
import { useState } from "react";
import BeerCard from "./beer-card";
import OrderFeed from "./order-feed";

type SortKey = "name" | "abv-asc" | "abv-desc";

export default function BeerCellar({ beers }: { beers: Beer[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = beers
    .filter((b) => filter === "all" || b.type === filter)
    .sort((a, b) => {
      if (sort === "abv-asc") return a.percentage - b.percentage;
      if (sort === "abv-desc") return b.percentage - a.percentage;
      return a.name.localeCompare(b.name);
    });

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {["all", ...BeerTypeArray].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === type ? "bg-amber-600 text-white" : "bg-white/80 text-gray-600 hover:bg-amber-100"
            }`}
          >
            {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="px-3 py-1.5 rounded-full text-sm bg-white/80 border-0"
        >
          <option value="name">A-Z</option>
          <option value="abv-desc">ABV ↓</option>
          <option value="abv-asc">ABV ↑</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-6 justify-center w-full">
        {filtered.length > 0 ? (
          filtered.map((beer) => <BeerCard key={beer.id} beer={beer} showOrder />)
        ) : (
          <div className="text-center py-12 text-gray-400">
            {beers.length > 0 ? "No beers match this filter." : "No beers yet."}
          </div>
        )}
      </div>

      <OrderFeed />
    </>
  );
}
