import {Accessor, Setter, Signal, createSignal} from 'solid-js'

export interface SignalObject<T>{
  get : Accessor<T>,
  set : Setter<T>
}

export interface SignalObjectArray<T>{
  asArray : ()=>SignalObject<T>[],
  get :  (i:number)=>SignalObject<T>,
  add : () => void,
  remove : (index : number) => void,
  selectedIndex : SignalObject<number | undefined>,
}