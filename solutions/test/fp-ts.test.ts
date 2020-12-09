import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/function";

describe("Array/Option", () => {
  it("traverse", () => {
    const traverseArrayOption = A.traverse(O.Applicative);

    expect(
      pipe(
        [0, 1, 2, 3],
        traverseArrayOption(O.fromPredicate((n) => n % 2 === 0))
      )
    ).toEqual(O.none);

    expect(
      pipe(
        [1, 2, 3],
        traverseArrayOption((n) => (n >= 0 ? O.some(10 / n) : O.none))
      )
    ).toEqual(O.some([10, 5, 10 / 3]));
  });
});

describe("Array/Either", () => {
  it("traverse", () => {
    const traverseArrayEither = A.traverse(E.Applicative);

    class NotEven {
      readonly _tag = "NotEven";
      constructor(readonly n: number) {}
    }

    const isEven = E.fromPredicate(
      (n: number) => n % 2 === 0,
      (n) => new NotEven(n)
    );

    const areAllEven = traverseArrayEither(isEven);

    expect(areAllEven([0, 1, 2, 3])).toEqual(E.left(new NotEven(1)));
  });
});
