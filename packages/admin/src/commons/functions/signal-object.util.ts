import { Signal, createSignal } from "solid-js";
import { SignalObject, SignalObjectArray } from "../interfaces/signal-object";

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

export function createSignalObjectArray<T>(newItemSignalFactory : ()=>SignalObject<T>): SignalObjectArray<T> {
  const [signal, setSignal] = createSignal<SignalObject<T>[]>([]);
  const selectedIndex = createSignalObject<number>();

  return {
    asArray : signal,
    get : (i)=>{
      return signal()[i];
    },
    add : ()=>setSignal([...signal(), newItemSignalFactory()]),
    remove : (index : number)=>{
      setSignal(signal().filter((_, i)=>i!==index));
      selectedIndex.set(undefined);
    },
    selectedIndex : selectedIndex,
  }
}