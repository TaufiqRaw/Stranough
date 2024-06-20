export function itemOr<T>(a : T | undefined, b : T) : T {
  return a || b;
}