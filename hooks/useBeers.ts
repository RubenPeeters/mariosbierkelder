import { Beer, BeerColorArray, BeerTypeArray } from "@/types";
import { useState } from "react";

export function useEmails() {
    const [beer, setBeer] = useState<Beer>({
        name: 'A beer',
        count: 0,
        color: BeerColorArray[0],
        percentage: 0,
        type: BeerTypeArray[0],
        imageURL: "",
    })

    return {beer, setBeer}
}