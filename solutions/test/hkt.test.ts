import { pipe } from "@app/Function";
import { addOne, MappableOption, MappableEither } from "@app/HKT";
import * as O from "@app/Option";
import * as E from "@app/Either";

const addOneOption = addOne(MappableOption);

const addOneEither = addOne(MappableEither);

it("addOneOption", () => {
  expect(pipe(O.some(1), addOneOption)).toEqual(O.some(2));
});
it("addOneEither", () => {
  expect(pipe(E.right(1), addOneEither)).toEqual(E.right(2));
});
