"use client";
import { Beer } from "@/types";
import { useEffect } from "react";
import { useBeers } from "@/hooks/useBeers";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import BeerIcon from "./beer-icon";

export default function BeerCard({
  beer,
  onClick,
}: {
  beer: Beer;
  onClick: any;
}) {
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
              className="object-cover w-64 h-48 rounded-lg"
              src="https://cdn.pixabay.com/photo/2017/06/24/23/41/beer-2439237_640.jpg"
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
      <CardFooter className="flex w-full justify-between">
        <div className="flex items-center justify-center h-10 w-18 border px-6 rounded-lg text-center font-bold text-gray-500">
          {beer.count}
        </div>
        <Button className="bg-red-600" onClick={onClick}>
          Choose
        </Button>
      </CardFooter>
    </Card>
  );
}
