"use client";
import { Beer } from "@/types";
import { Star, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import BeerIcon from "./beer-icon";
import { useTranslation } from "@/providers/language";

type Review = { reviewer_name: string | null; review_text: string; score: number; created_at: string };
type RatingData = { avg: number | null; total: number; reviews: Review[] };

function generateMathQuestion() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer: number;
  if (op === "+") answer = a + b;
  else if (op === "-") answer = a - b;
  else answer = a * b;
  return { question: `${a} ${op} ${b} = ?`, answer };
}

export default function BeerDetail({ beer, onClose }: { beer: Beer; onClose: () => void }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState<RatingData>({ avg: null, total: 0, reviews: [] });
  const [hovered, setHovered] = useState(0);
  const [selectedScore, setSelectedScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [mathInput, setMathInput] = useState("");
  const [mathError, setMathError] = useState(false);
  const math = useMemo(() => generateMathQuestion(), []);

  useEffect(() => {
    fetch(`/api/ratings?beerId=${beer.id}`).then(r => r.json()).then(setRating);
  }, [beer.id, submitted]);

  const submitRating = async () => {
    if (selectedScore === 0) return;
    if (Number(mathInput) !== math.answer) {
      setMathError(true);
      return;
    }
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        beerId: beer.id,
        score: selectedScore,
        reviewerName: reviewerName.trim(),
        reviewText: reviewText.trim(),
        mathAnswer: Number(mathInput),
        mathExpected: math.answer,
      }),
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
              {beer.ibu ? ` · ${beer.ibu} IBU` : ""}
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
              <div className="flex flex-col gap-3">
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setSelectedScore(s)}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${s <= (hovered || selectedScore) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
                {selectedScore > 0 && (
                  <>
                    <input
                      className="border rounded px-3 py-2 text-sm w-full"
                      placeholder={t("yourName")}
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                    />
                    <textarea
                      className="border rounded px-3 py-2 text-sm w-full"
                      placeholder={t("writeReview")}
                      rows={2}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-muted-foreground whitespace-nowrap">{math.question}</label>
                      <input
                        className={`border rounded px-3 py-2 text-sm w-20 ${mathError ? "border-red-400" : ""}`}
                        type="number"
                        value={mathInput}
                        onChange={(e) => { setMathInput(e.target.value); setMathError(false); }}
                      />
                    </div>
                    {mathError && <p className="text-xs text-red-500">{t("wrongAnswer")}</p>}
                    <button
                      onClick={submitRating}
                      className="bg-amber-600 text-white rounded-lg py-2 text-sm font-bold hover:bg-amber-700"
                    >
                      {t("submitReview")}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="text-center text-sm text-amber-600 font-medium">{t("thanksRating")}</p>
            )}
          </div>

          {rating.reviews.length > 0 && (
            <div className="border-t w-full pt-4 mt-2">
              <p className="text-xs font-bold text-gray-500 mb-2">{t("reviews")}</p>
              <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
                {rating.reviews.map((r, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{r.reviewer_name || t("anonymous")}</span>
                      <span className="text-xs text-amber-500">{"★".repeat(r.score)}{"☆".repeat(5 - r.score)}</span>
                    </div>
                    <p className="text-muted-foreground">{r.review_text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
