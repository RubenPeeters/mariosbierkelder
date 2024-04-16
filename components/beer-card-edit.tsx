"use client";
import { Beer } from "@/types";
import { useEffect } from "react";
import { useBeers } from "@/hooks/useBeers";
import Image from "next/image";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BeerIcon from "./beer-icon";

export default function BeerCard({ beer }: { beer: Beer }) {
  const { loading, setLoading } = useBeers();

  useEffect(() => {
    setLoading(false);
  });

  return (
    <Card className="flex flex-col justify-center items-center text-center w-[300px] h-[400px] overflow-hidden">
      <CardHeader className="py-12">
        <CardTitle className="flex flex-col gap-6 items-center justify-center">
          {beer.imageUrl ? (
            <Image
              className="object-contain w-64 h-48 rounded-lg"
              src={beer.imageUrl}
              alt=""
              width={1000}
              height={1000}
            ></Image>
          ) : (
            <BeerIcon></BeerIcon>
          )}
          <div className="flex justify-center gap-2 items-end align-baseline">
            <p>{beer.name}</p>
            <span className="text-xs text-gray-400">{beer.percentage}%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex w-full justify-end">
        <div className="flex items-center justify-center h-10 w-18 border-2 border-red-600 px-6 rounded-lg text-center font-bold">
          {beer.count}
        </div>
      </CardFooter>
    </Card>
  );
}
