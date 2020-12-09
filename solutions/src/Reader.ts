export type Reader<R, A> = (r: R) => A;

export type AOfReader<B> = [B] extends [Reader<infer _R, infer _A>]
  ? _A
  : never;
export type ROfReader<B> = [B] extends [Reader<infer _R, infer _A>]
  ? _R
  : never;

export function access<R, A>(f: (_: R) => A): Reader<R, A> {
  return f;
}

export function accessM<R, R0, A>(
  f: (_: R) => Reader<R0, A>
): Reader<R & R0, A> {
  return chain(access(f), (x) => x);
}

export function of<A>(a: A): Reader<unknown, A> {
  return () => a;
}

export function map<A, B>(
  f: (a: A) => B
): <R>(self: Reader<R, A>) => Reader<R, B> {
  return (self) => (r) => f(self(r));
}

export function chain<R, R0, A, B>(
  self: Reader<R, A>,
  f: (a: A) => Reader<R0, B>
): Reader<R & R0, B> {
  return (r) => f(self(r))(r);
}

export interface ConsoleService {
  ConsoleService: {
    log: (message: string) => Reader<unknown, void>;
  };
}

export interface MathService {
  MathService: {
    add: (a: number, b: number) => number;
  };
}

export function logMessage(message: string) {
  return accessM(({ ConsoleService: { log } }: ConsoleService) =>
    log(`message: ${message}`)
  );
}

export function add(a: number, b: number) {
  return access(({ MathService: { add } }: MathService) => add(a, b));
}

export function tuple<X extends readonly Reader<any, any>[]>(
  ...params: X & { readonly 0: Reader<any, any> }
): Reader<ROfReader<X[number]>, { [k in keyof X]: AOfReader<X[k]> }>;
export function tuple(...params: Reader<any, any>[]): Reader<any, any> {
  return (r) => params.map((f) => f(r));
}

export const MathLive: MathService = {
  MathService: {
    add: (x, y) => x + y,
  },
};
