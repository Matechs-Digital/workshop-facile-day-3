import * as O from "@app/Option";
import * as E from "@app/Either";
import * as R from "@app/Reader";
import * as Int from "@app/Int";
import { pipe } from "@app/Function";

it("tuple option - some", () => {
  const x = O.tuple(O.some(0), O.some(1), O.some(2));

  expect(x).toEqual(O.some([0, 1, 2]));
});
it("tuple option - none", () => {
  const x = O.tuple(O.some(0), O.some(1), O.some(2), <O.Option<number>>O.none);

  expect(x).toEqual(O.none);
});
it("tuple either - right", () => {
  const x = E.tuple(E.right(0), E.right(1), E.right(2));

  expect(x).toEqual(E.right([0, 1, 2]));
});
it("tuple either - left", () => {
  const x = E.tuple(
    E.right(0),
    E.left("a" as const),
    E.left("b" as const),
    E.left("c" as const),
    E.right(2)
  );

  expect(x).toEqual(E.left("a"));
});
it("tupleValidation either - right", () => {
  const x = E.tupleValidation(E.right(0), E.right(2));

  expect(x).toEqual(E.right([0, 2]));
});
it("tupleValidation either - left", () => {
  const x = E.tupleValidation(
    E.right(0),
    E.left("a" as const),
    E.left("b" as const),
    E.left("c" as const),
    E.right(2)
  );

  expect(x).toEqual(E.left(["a", "b", "c"]));
});
it("tuple reader", () => {
  const f = jest.fn();
  const g = jest.fn();
  const x = R.tuple(R.add(1, 2), R.add(3, 2), R.logMessage("hi"));

  const r = x({
    MathService: {
      add: (x, y) => {
        g(x, y);
        return R.MathLive.MathService.add(x, y);
      },
    },
    ConsoleService: {
      log: (message) => () => {
        f(message);
      },
    },
  });

  expect(r).toEqual([3, 5, undefined]);
  expect(f).toHaveBeenCalledTimes(1);
  expect(f).toHaveBeenNthCalledWith(1, "message: hi");
});
it("check integers", () => {
  const x = Int.prismInt.getOption(0);
  const y = Int.prismInt.getOption(1.3);
  expect(x).toEqual(O.some(0));
  expect(y).toEqual(O.none);
});
it("add integers", () => {
  const res = pipe(
    O.tuple(Int.wrap(0), Int.wrap(1.3)),
    O.map(([x, y]) => Int.add(x, y))
  );
  const res2 = pipe(
    O.tuple(Int.wrap(0), Int.wrap(1)),
    O.map(([x, y]) => Int.add(x, y))
  );

  expect(res).toEqual(O.none);
  expect(res2).toEqual(O.some(1));
});
