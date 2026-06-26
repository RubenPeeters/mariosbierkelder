"use client";

import { Beer } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/beer-cellar.webp')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-amber-900/60" />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Beer className="w-12 h-12 text-amber-400" />
        <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight">
          Mario&apos;s Bierkelder
        </h1>
        <p className="text-lg text-amber-100/80">Welcome to the cellar</p>
        <a
          href="/beers"
          className="mt-4 px-8 py-3 bg-amber-600 text-white font-bold rounded-xl text-lg hover:bg-amber-700 transition-colors"
        >
          Enter the Cellar
        </a>
      </motion.div>
    </div>
  );
}
