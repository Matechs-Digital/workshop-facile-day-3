import { Branded, brandedIso } from "./Branded";

export type Int = Branded<"Int", number>;

const isoInt = brandedIso<Int>();

export function isInt(x: number): x is Int {
  return Number.isInteger(x);
}

export function add(x: Int, y: Int): Int {
  return isoInt.get(x + y);
}

export function div(x: Int, y: Int): Int {
  return isoInt.get(x / y);
}
