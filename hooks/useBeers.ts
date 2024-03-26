import { supabase } from "@/lib/supabase";
import { Beer, BeerColorArray, BeerTypeArray } from "@/types";
import { useState } from "react";

export function useBeer() {
    const [beer, setBeer] = useState<Beer>({
        name: 'A beer',
        count: 0,
        color: BeerColorArray[0],
        percentage: 0,
        type: BeerTypeArray[0],
        imageUrl: "",
    })

    return {beer, setBeer}
}

export const useBeers = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [beers, setBeers] = useState<Beer[]>([]);
    const [success, setSuccess] = useState<boolean | undefined>(undefined)
  
    const getBeers = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('beers')
          .select('*')
        
        if (data) setBeers(data)
      } catch (error) {
        console.log(error)
      } finally {
       setLoading(false)
      }
    }
    return {
        loading,
        setLoading,
        beers,
        setBeers,
        getBeers,
        success,
        setSuccess,
      }
    }