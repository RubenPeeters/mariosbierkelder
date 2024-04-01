"use client";
import BeerCard from "@/components/beer-card";
import Loading from "@/components/loading";
import SmallBeerIcon from "@/components/small-beer-icon";
import { Button } from "@/components/ui/button";
import { useBeers } from "@/hooks/useBeers";
import { useNavigation } from "@/hooks/useNavigation";
import { Beer } from "@/types";
import { MessageSquare, Send, ShoppingBasket, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Beers() {
  const { selected, setSelected } = useNavigation();
  const { loading, beers, getBeers } = useBeers();
  const [selectedBeers, setSelectedBeers] = useState<Beer[]>([]);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    getBeers();
  }, []);

  function addToSelectedBeer(i: number) {
    const newBeers = selectedBeers;
    newBeers.push(beers[i]);
    setSelectedBeers(newBeers);
  }

  const removeBeer = (beerId: string) => {
    setSelectedBeers(
      selectedBeers.filter((selectedBeers) => selectedBeers.id !== beerId)
    );
  };

  return (
    <div className="flex flex-col justify-center items-center w-full bg-gray-100">
      {show && (
        <div className="w-full h-full bg-gray-100">
          <div className="fixed top-0 right-0 z-15 w-full h-full bg-black bg-opacity-70"></div>
          <div className="flex flex-col fixed top-0 right-0 h-full border-l w-[400px] bg-white z-10">
            <div className="flex justify-end w-full p-4 text-5xl">
              <button title="X" onClick={() => setShow(!show)}>
                <X></X>
              </button>
            </div>
            <ul role="list" className="divide-y divide-gray-100 z-1 px-6 grow">
              {selectedBeers.map((beer, i) => (
                <li key={i} className="flex justify-between gap-x-6 py-6">
                  <div className="flex min-w-0 gap-x-4 ">
                    {beer.imageUrl ? (
                      <Image
                        className="object-cover w-12 h-12 rounded-lg"
                        src="https://cdn.pixabay.com/photo/2017/06/24/23/41/beer-2439237_640.jpg"
                        alt=""
                        width={1000}
                        height={1000}
                      ></Image>
                    ) : (
                      <SmallBeerIcon></SmallBeerIcon>
                    )}
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {beer.name}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {beer.percentage} %
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    {/* <p className="text-sm leading-6 text-gray-900">
                      {beer.type}
                    </p> */}

                    <div className="mt-1 flex items-center gap-x-1.5">
                      <Button
                        className="bg-gray-600 p-3 font-semibold"
                        onClick={() => {
                          removeBeer(beer.id);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-end px-6 py-4">
              <button title="order">
                <Send></Send>
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="fixed top-0 left-0 z-5 flex justify-evenly items-center w-full py-10 bg-gray-100">
        <div></div>
        <h1 className="text-3xl font-semibold decoration-red-600 underline">
          CELLAR
        </h1>
        <div>
          <button title="basket" onClick={() => setShow(!show)}>
            <ShoppingBasket></ShoppingBasket>
          </button>
        </div>
      </header>
      <main className="max-w-7xl bg-gray-100 pt-36">
        {loading && (
          <>
            <Loading />
          </>
        )}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {beers.length > 0 &&
              beers.map(
                (beer: Beer, i: number) =>
                  beer.count > 0 && (
                    <BeerCard
                      key={i}
                      beer={beer}
                      onClick={() => addToSelectedBeer(i)}
                    />
                  )
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
