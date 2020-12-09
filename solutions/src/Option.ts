export interface None {
  _tag: "None";
}

export interface Some<A> {
  _tag: "Some";
  value: A;
}

export type Option<A> = None | Some<A>;

export type AOfOption<A> = [A] extends [Option<infer X>] ? X : never;

export const none: Option<never> = {
  _tag: "None",
};

export function some<A>(value: A): Option<A> {
  return {
    _tag: "Some",
    value,
  };
}

export function map<A, B>(f: (a: A) => B): (self: Option<A>) => Option<B> {
  return (self) => {
    if (self._tag === "None") {
      return self;
    }
    return some(f(self.value));
  };
}

export function chain<A, B>(
  f: (a: A) => Option<B>
): (self: Option<A>) => Option<B> {
  return (self) => {
    if (self._tag === "None") {
      return self;
    }
    return f(self.value);
  };
}

export function tuple<ARGS extends readonly Option<any>[]>(
  ...params: ARGS & { readonly 0: Option<any> }
): Option<
  Readonly<
    {
      [k in keyof ARGS]: AOfOption<ARGS[k]>;
    }
  >
>;
export function tuple(...params: readonly Option<any>[]): Option<any> {
  let res: any[] = [];
  for (const o of params) {
    if (o._tag === "None") {
      return o;
    }
    res.push(o.value);
  }
  return some(res);
}
