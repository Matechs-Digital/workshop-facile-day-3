import * as O from "@app/Option";
import { Iso, Prism } from ".";

export type Branded<URI, A> = A & {
  _brand: URI;
};

export function brandedIso<N extends Branded<any, any>>(): Iso<
  Omit<N, "_brand">,
  N
> {
  return {
    get: (x) => x as any,
    reverseGet: (x) => x,
  };
}

export function brandedPrism<N extends Branded<any, any>>(
  predicate: (a: Omit<N, "_brand">) => boolean
): Prism<Omit<N, "_brand">, N> {
  return {
    getOption: (a) => (predicate(a) ? O.some(a) : O.none) as any,
    reverseGet: (x) => x,
  };
}
