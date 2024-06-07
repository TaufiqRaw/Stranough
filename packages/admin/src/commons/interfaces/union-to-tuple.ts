type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0
  ? I
  : never;

// LastInUnion<A | B> = B
type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never;

// UnionToTuple<A, B> = [A, B]
export type UnionToTuple<T, Last = LastInUnion<T>> = [T] extends [never]
  ? []
  : [Last,...UnionToTuple<Exclude<T, Last>>]