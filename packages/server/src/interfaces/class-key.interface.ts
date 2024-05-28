export type KeyOf<T> = {
  [key in keyof T] ?: any;
}