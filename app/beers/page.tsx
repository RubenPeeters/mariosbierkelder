"use client";
import BeerCard from "@/components/beer-card";
import Loading from "@/components/loading";
import { useBeers } from "@/hooks/useBeers";
import { useNavigation } from "@/hooks/useNavigation";
import { Beer } from "@/types";
import { useEffect } from "react";

export default function Beers() {
  const { selected, setSelected } = useNavigation();
  const { loading, beers, getBeers } = useBeers();

  useEffect(() => {
    getBeers();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full bg-gray-100">
      <header>
        <h1 className="text-3xl my-24 font-semibold decoration-red-600 underline">
          CELLAR
        </h1>
      </header>
      <main className="grid grid-cols-1 max-w-7xl">
        {loading && <Loading />}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {beers.length > 0 &&
              beers.map(
                (beer: Beer, i: number) =>
                  beer.count > 0 && <BeerCard key={i} beer={beer} />
              )}
            {beers.length === 0 && (
              <div className="grid gap-4 items-center justify-center w-full py-24 border rounded-xl shadow-sm">
                <p>No beers yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
