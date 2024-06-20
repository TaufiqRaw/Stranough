import { Accessor, Signal, createMemo, createSignal } from "solid-js";
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

export function createSignalObjectArray<T, U = T>(val : U[] | undefined, itemFactory ?: (item : U)=>T , defaultValue ?: U): SignalObjectArray<T, U> {
  const [signal, setSignal] = createSignal<SignalObject<T>[]>(
    val ? val.map(v=>createSignalObject(itemFactory? itemFactory(v) : v as unknown as T)) : []
  );
  const selectedIndex = createSignalObject<number>();

  return {
    state : signal,
    setState : setSignal,
    get : (i)=>{
      return signal()[i];
    },
    add : (v ?: U)=>{setSignal([...signal(), createSignalObject( v ? itemFactory ? itemFactory(v) : v as T : itemFactory ? itemFactory(defaultValue as U): defaultValue as T)])},
    remove : (index : number)=>{
      setSignal(signal().filter((_, i)=>i!==index));
      selectedIndex.set(undefined);
    },
    getSelectedSignal : ()=>selectedIndex.get() !== undefined ? signal()[selectedIndex.get()!] : undefined,
    selectedIndex : selectedIndex,
  }
}