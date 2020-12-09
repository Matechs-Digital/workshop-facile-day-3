import * as E from "fp-ts/Either";
import * as t from "io-ts";
import { DateFromISOString } from "io-ts-types/DateFromISOString";
import { failure } from "io-ts/PathReporter";

type NonEmptyString = t.Branded<
  string,
  { readonly NonEmptyString: unique symbol }
>;

const NonEmptyString = t.brand(
  t.string,
  (s): s is NonEmptyString => s.length > 0,
  "NonEmptyString"
);

type NonEmptyStringArray = t.Branded<
  string[],
  { readonly NonEmptyStringArray: unique symbol }
>;

const NonEmptyStringArray = t.brand(
  t.array(t.string),
  (s): s is NonEmptyStringArray => s.length > 0,
  "NonEmptyStringArray"
);

const Person = t.intersection([
  t.type({
    firstName: NonEmptyString,
    lastName: t.string,
    createdAt: DateFromISOString,
  }),
  t.partial({
    middleName: t.string,
  }),
]);

export interface Person extends t.TypeOf<typeof Person> {}

const x: E.Either<t.Errors, Person> = Person.decode({
  firstName: "Michael",
  lastName: "Arnaldi",
  middleName: "ssss",
  createdAt: "2020-12-09T16:35:05.942Z",
});

if (E.isLeft(x)) {
  console.log(failure(x.left));
} else {
  x.right;

  console.log(Person.encode(x.right));
}
