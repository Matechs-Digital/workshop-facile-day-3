import * as E from "./Either";
import { pipe } from "./Function";
import * as O from "./Option";
import * as R from "./Reader";

// type F[_, _]

export const OptionURI = "Option";
export type OptionURI = typeof OptionURI;

export type IO<A> = () => A;
export const IOURI = "IO";
export type IOURI = typeof IOURI;

export interface URItoKind<A> {
  [OptionURI]: O.Option<A>;
  [IOURI]: IO<A>;
}

export const EitherURI = "Either";
export type EitherURI = typeof EitherURI;

export const ReaderURI = "Reader";
export type ReaderURI = typeof ReaderURI;

export interface URItoKind2<E, A> {
  [EitherURI]: E.Either<E, A>;
  [ReaderURI]: R.Reader<E, A>;
}

export type URIS = keyof URItoKind<any>;
export type URIS2 = keyof URItoKind2<any, any>;

export type Kind<F extends URIS, A> = URItoKind<A>[F];
export type Kind2<F extends URIS2, E, A> = URItoKind2<E, A>[F];

export interface HKT<F, A> {
  F: F;
  A: A;
}

export interface Mappable<F> {
  readonly URI: F;
  readonly map: <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>;
}

export interface Mappable1<F extends URIS> {
  readonly URI: F;
  readonly map: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;
}

export interface Mappable2<F extends URIS2> {
  readonly URI: F;
  readonly map: <A, B>(
    f: (a: A) => B
  ) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>;
}

export const MappableOption: Mappable1<OptionURI> = {
  URI: OptionURI,
  map: O.map,
};

export const MappableIO: Mappable1<IOURI> = {
  URI: IOURI,
  map: (f) => (fa) => () => f(fa()),
};

export const MappableEither: Mappable2<EitherURI> = {
  URI: EitherURI,
  map: E.map,
};

export const MappableReader: Mappable2<ReaderURI> = {
  URI: ReaderURI,
  map: R.map,
};

export function addOne<F extends URIS2>(
  F: Mappable2<F>
): <E>(fa: Kind2<F, E, number>) => Kind2<F, E, number>;
export function addOne<F extends URIS>(
  F: Mappable1<F>
): (fa: Kind<F, number>) => Kind<F, number>;
export function addOne<F>(
  F: Mappable<F>
): (fa: HKT<F, number>) => HKT<F, number> {
  return (fa) =>
    pipe(
      fa,
      F.map((n) => n + 1)
    );
}
