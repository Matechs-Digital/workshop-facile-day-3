import * as E from "@app/Either";
import * as O from "@app/Option";
import { flow, pipe } from "./Function";
import { Newtype, newtypePrism } from "./Newtype";
import { Int, isoInt, wrap } from "./Int";

export interface UserId extends Newtype<"UserID", Int> {}

export const userIdPrism = newtypePrism<UserId>(
  (i) => isoInt.reverseGet(i) > 0
);

export class NotPositive {
  readonly _tag = "NotPositive";
  constructor(readonly i: Int) {}
}

export const wrapUserId = (x: Int): E.Either<NotPositive, UserId> =>
  pipe(x, userIdPrism.getOption, isPositive(x));

export const newId = flow(wrap, E.chain(wrapUserId));

function isPositive(
  x: Int
): (_: O.Option<UserId>) => E.Either<NotPositive, UserId> {
  return (i) =>
    i._tag === "None" ? E.left(new NotPositive(x)) : E.right(i.value);
}
