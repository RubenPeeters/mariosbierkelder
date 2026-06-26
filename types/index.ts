type CommonFields = {
  id: string;
  created_at?: string;
};

export const CategoryArray = ["beer", "wine", "spirit", "soft drink"] as const;
export const BeerTypeArray = [
  "lager", "pilsner", "ale", "ipa", "stout", "porter",
  "wheat", "tripel", "dubbel", "saison", "sour", "other",
] as const;
export const BeerColorArray = ["pale", "golden", "amber", "brown", "dark"] as const;

type Category = (typeof CategoryArray)[number];
type BeerColor = (typeof BeerColorArray)[number];
type BeerType = (typeof BeerTypeArray)[number];

export type Beer = {
  name: string;
  count: number;
  category: Category;
  color?: BeerColor;
  percentage: number;
  type: BeerType;
  imageUrl: string;
  description?: string;
  brewery?: string;
  country?: string;
  ibu?: number;
} & CommonFields;

export type Rating = {
  beer_id: string;
  score: number;
} & CommonFields;

export type Order = {
  beer_id: string;
  beer_name: string;
  status: "pending" | "confirmed" | "rejected";
  resolved_at?: string;
} & CommonFields;

export type User = { email: string } & CommonFields;
