export interface Left<E> {
  _tag: "Left";
  left: E;
}

export interface Right<A> {
  _tag: "Right";
  right: A;
}

export type Either<E, A> = Left<E> | Right<A>;

export type EOfEither<B> = [B] extends [Either<infer _E, infer _A>]
  ? _E
  : never;

export type AOfEither<B> = [B] extends [Either<infer _E, infer _A>]
  ? _A
  : never;

export function left<E>(e: E): Either<E, never> {
  return {
    _tag: "Left",
    left: e,
  };
}

export function right<A>(a: A): Either<never, A> {
  return {
    _tag: "Right",
    right: a,
  };
}

export function map<A, B>(
  f: (a: A) => B
): <E>(self: Either<E, A>) => Either<E, B> {
  return (self) => {
    if (self._tag === "Left") {
      return left(self.left);
    }
    return right(f(self.right));
  };
}

export function chain<E0, A, B>(
  f: (a: A) => Either<E0, B>
): <E>(self: Either<E, A>) => Either<E | E0, B> {
  return (self) => {
    if (self._tag === "Right") {
      return f(self.right);
    }

    return left(self.left);
  };
}

export function flatten<E, E0, A>(
  ffa: Either<E, Either<E0, A>>
): Either<E | E0, A> {
  if (ffa._tag === "Right") {
    return ffa.right;
  }

  return ffa;
}

export function catchAll<E, E1, B>(
  f: (a: E) => Either<E1, B>
): <A>(self: Either<E, A>) => Either<E1, A | B> {
  return (self) => {
    if (self._tag === "Left") {
      return f(self.left);
    }

    return self;
  };
}

export function tuple<X extends readonly Either<any, any>[]>(
  ...params: X & { readonly 0: Either<any, any> }
): Either<
  EOfEither<X[number]>,
  Readonly<
    {
      [k in keyof X]: AOfEither<X[k]>;
    }
  >
>;
export function tuple(
  ...params: readonly Either<any, any>[]
): Either<any, any> {
  let res: any[] = [];
  for (const o of params) {
    if (o._tag === "Left") {
      return o;
    }
    res.push(o.right);
  }
  return right(res);
}

export type NonEmptyArray<A> = readonly A[] & { readonly 0: A };

export function tupleValidation<X extends readonly Either<any, any>[]>(
  ...params: X & { readonly 0: Either<any, any> }
): Either<
  NonEmptyArray<EOfEither<X[number]>>,
  Readonly<
    {
      [k in keyof X]: AOfEither<X[k]>;
    }
  >
>;
export function tupleValidation(
  ...params: readonly Either<any, any>[]
): Either<any, any> {
  let res: any[] = [];
  let errs: any[] = [];
  for (const o of params) {
    if (o._tag === "Left") {
      errs.push(o.left);
    } else {
      res.push(o.right);
    }
  }
  return errs.length > 0 ? left(errs) : right(res);
}
