import { Signal, createSignal } from "solid-js";
import { SignalObject } from "../interfaces/signal-object.interface";

export function createSignalObject<T>(): SignalObject<T | undefined>;
export function createSignalObject<T>(value: T): SignalObject<T>;
export function createSignalObject<T>(value? : T) : any {
  const signal = createSignal(value);
  return signalObjectfromSignal(signal);
}
export function signalObjectfromSignal<T>(signal : Signal<T>) : SignalObject<T>{
  return {
    get : signal[0],
    set : signal[1]
  }
}