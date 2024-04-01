"use client";

import { Beer } from "lucide-react";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";

export default function Home() {
  const imageUrl =
    "https://files.oaiusercontent.com/file-jUwYMGgz2c1FxfqebJGygpoP?se=2024-04-01T12%3A39%3A22Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Dbc6545de-116b-4bd8-9891-06c5ce6f5ee7.webp&sig=TzoPrrGfXck8XSMt/fOfJV8wBToFSUhXKsqm9gxIKXY%3D";
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
