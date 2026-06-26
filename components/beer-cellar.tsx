"use client";
import { Beer, BeerTypeArray, CategoryArray } from "@/types";
import { useState } from "react";
import { useTranslation } from "@/providers/language";
import BeerCard from "./beer-card";
import OrderFeed from "./order-feed";

type SortKey = "name" | "abv-asc" | "abv-desc";

export default function BeerCellar({ beers }: { beers: Beer[] }) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = beers
    .filter((b) => category === "all" || b.category === category)
    .filter((b) => type === "all" || b.type === type)
    .sort((a, b) => {
      if (sort === "abv-asc") return a.percentage - b.percentage;
      if (sort === "abv-desc") return b.percentage - a.percentage;
      return a.name.localeCompare(b.name);
    });

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6 justify-center items-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1.5 rounded-full text-sm bg-white/80 border-0"
        >
          <option value="all">{t("all")}</option>
          {CategoryArray.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-1.5 rounded-full text-sm bg-white/80 border-0"
        >
          <option value="all">{t("type")}: {t("all")}</option>
          {BeerTypeArray.map((bt) => (
            <option key={bt} value={bt}>{bt.charAt(0).toUpperCase() + bt.slice(1)}</option>
          ))}
        </select>
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
            {beers.length > 0 ? t("noMatch") : t("noBeers")}
          </div>
        )}
      </div>

      <OrderFeed />
    </>
  );
}
