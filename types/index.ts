type CommonFields = {
  id?: string;
  created_at?: string;
};

export const BeerColorArray = ["amber", "gold", "brown"];
export const BeerTypeArray = ["lager", "ale", "stout", "wheat beer"];

// export const AlcoholTypeArray = ["wine", "beer", "spirit", "liquor", "cider/perry", "mead"];
// type BeverageType = typeof AlcoholTypeArray

type BeerColor = typeof BeerColorArray[number];
type BeerType = typeof BeerTypeArray[number];

export type Beer = {
  name: string;
  count: number;
  color?: BeerColor;
  percentage: number;
  type: BeerType;
  imageUrl: string;
} & CommonFields;

export type User = { email: string } & CommonFields;
