import * as E from "@app/Either";
import { pipe } from "./Function";
import { Newtype, newtypeIso, newtypePrism } from "./Newtype";

export interface Int extends Newtype<"Int", number> {}

export const isoInt = newtypeIso<Int>();

export const prismInt = newtypePrism<Int>((n) => Number.isInteger(n));

export function add(x: Int, y: Int): Int {
  return isoInt.get(isoInt.reverseGet(x) + isoInt.reverseGet(y));
}

export class NotAnInteger {
  readonly _tag = "NotAnInteger";
  constructor(readonly n: number) {}
}

export const wrap = (x: number): E.Either<NotAnInteger, Int> =>
  pipe(x, prismInt.getOption, (i) =>
    i._tag === "None" ? E.left(new NotAnInteger(x)) : E.right(i.value)
  );

export function div(x: Int, y: Int): Int {
  return isoInt.get(isoInt.reverseGet(x) / isoInt.reverseGet(y));
}
