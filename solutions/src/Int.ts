import { Newtype, newtypeIso, newtypePrism } from "./Newtype";

export interface Int extends Newtype<"Int", number> {}

const isoInt = newtypeIso<Int>();

export const prismInt = newtypePrism<Int>((n) => Number.isInteger(n));

export function add(x: Int, y: Int): Int {
  return isoInt.get(isoInt.reverseGet(x) + isoInt.reverseGet(y));
}

export const wrap = prismInt.getOption;
