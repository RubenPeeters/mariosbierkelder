import { Beer } from "@/types";
import { useState } from "react";

export function useBeer() {
  const [beer, setBeer] = useState<Beer>({
    id: "",
    name: "A beer",
    count: 0,
    category: "beer",
    color: "amber",
    percentage: 0,
    type: "lager",
    imageUrl: "",
  });
  return { beer, setBeer };
}

export const useBeers = () => {
  const [loading, setLoading] = useState(true);
  const [beers, setBeers] = useState<Beer[]>([]);

  const getBeers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/beers");
      const data = await res.json();
      setBeers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, setLoading, beers, setBeers, getBeers };
};
