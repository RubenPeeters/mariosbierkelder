"use client";
import { Beer } from "@/types";
import { Star, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import BeerIcon from "./beer-icon";
import { useTranslation } from "@/providers/language";

export default function BeerDetail({ beer, onClose }: { beer: Beer; onClose: () => void }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState<{ avg: number | null; total: number }>({ avg: null, total: 0 });
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/ratings?beerId=${beer.id}`).then(r => r.json()).then(setRating);
  }, [beer.id, submitted]);

  const submitRating = async (score: number) => {
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beerId: beer.id, score }),
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-xl max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-4">
          {beer.imageUrl ? (
            <Image className="object-contain w-48 h-36 rounded-lg" src={beer.imageUrl} alt="" width={500} height={500} />
          ) : (
            <BeerIcon />
          )}

          <div className="text-center">
            <h2 className="text-2xl font-bold">{beer.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {beer.type} · {beer.percentage}% ABV
              {beer.brewery && ` · ${beer.brewery}`}
            </p>
            {beer.country && <p className="text-xs text-muted-foreground">{beer.country}</p>}
          </div>

          {beer.description && (
            <p className="text-sm text-center text-muted-foreground">{beer.description}</p>
          )}

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{beer.count}</span> {t("inStock")}
          </div>

          <div className="border-t w-full pt-4 mt-2">
            <p className="text-xs text-center text-muted-foreground mb-2">
              {rating.total > 0 ? `${rating.avg}/5 (${rating.total})` : t("noRatings")}
            </p>
            {!submitted ? (
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => submitRating(s)}
                    className="p-1"
                  >
                    <Star className={`w-6 h-6 ${s <= hovered ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-amber-600 font-medium">{t("thanksRating")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
