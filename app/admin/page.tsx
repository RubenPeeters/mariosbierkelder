"use client";
import BeerCard from "@/components/beer-card";
import Loading from "@/components/loading";
import { useBeers } from "@/hooks/useBeers";
import { Beer } from "@/types";
import { useEffect, useState } from "react";

export default function Beers() {
  const { loading, beers, getBeers } = useBeers();

  useEffect(() => {
    getBeers();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full bg-gray-100">
      <header className="fixed top-0 left-0 z-5 flex justify-evenly items-center w-full py-10 bg-gray-100">
        <h1 className="text-3xl font-semibold decoration-red-600 underline">
          CELLAR
        </h1>
      </header>
      <main className="max-w-7xl bg-gray-100 pt-36">
        {loading && (
          <>
            <Loading />
          </>
        )}
        {!loading && (
          <div className="flex flex-wrap gap-6 justify-center w-full">
            {beers.length > 0 &&
              beers.map((beer: Beer, i: number) => (
                <BeerCard key={i} beer={beer} />
              ))}
            {beers.length === 0 && (
              <div className="grid gap-4 items-center justify-center w-full py-24 border rounded-xl shadow-sm">
                <p>No beers yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="flex h-48 justify-center items-center">
        <div className="text-xs p-6">
          <p>
            Created by{" "}
            <a className="text-red-500" href="https://pragmix.io">
              PragmiX
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
