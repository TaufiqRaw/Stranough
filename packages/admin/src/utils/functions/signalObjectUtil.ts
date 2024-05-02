import { Signal, createSignal } from "solid-js";
import { SignalObject } from "../interfaces/SignalObject";

export namespace SignalObjectUtil {
  export function create<T>(): SignalObject<T | undefined>;
  export function create<T>(value: T): SignalObject<T>;
  export function create<T>(value? : T) : any {
    const signal = createSignal(value);
    return fromSignal(signal);
  }

  export function fromSignal<T>(signal : Signal<T>) : SignalObject<T>{
    return {
      get : signal[0],
      set : signal[1]
    }
  }
}