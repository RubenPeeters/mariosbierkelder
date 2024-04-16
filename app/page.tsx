"use client";

import { Beer } from "lucide-react";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";

export default function Home() {
  const imageUrl =
    "https://utfs.io/f/a471f2e7-dbdd-4d22-9786-961b0e03b152-tmljm1.webp";
  return (
    <div className="flex flex-col justify-center items-center w-full bg-gray-100">
      <header className="fixed top-0 left-0 flex justify-evenly items-center w-full py-10 bg-gray-100">
        <h1 className="flex gap-2 text-3xl font-semibold decoration-red-600 underline align-baseline">
          MARIO <Beer className="w-8 h-8"></Beer>
        </h1>
      </header>
      <main className="max-w-7xl bg-gray-100 h-screen">
        <a
          href="/beers"
          className="h-full relative flex items-center justify-center px-4"
        >
          <DirectionAwareHover imageUrl={imageUrl}>
            <p className="font-bold ">Enter...</p>
          </DirectionAwareHover>
        </a>
      </main>
    </div>
  );
}
