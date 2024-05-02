import { BaseEntity } from "../entities/base.entity";

type FunctionPropertyNames<T> = { 
  [K in keyof T]: T[K] extends Function ? K : never 
}[keyof T];

export type EntityWithoutBase<T> = {
  [K in keyof Omit<Omit<T, keyof BaseEntity >, FunctionPropertyNames<T>>] : T[K]
}