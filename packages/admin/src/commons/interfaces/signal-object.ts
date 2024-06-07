import {Accessor, Setter, Signal, createSignal} from 'solid-js'

export interface SignalObject<T>{
  get : Accessor<T>,
  set : Setter<T>
}

export type setterParameter<T> = ((z : T | undefined)=>undefined | (T | undefined)) | undefined

export interface SignalObjectArray<T, U>{
  state : ()=>SignalObject<T>[],
  setState : Setter<SignalObject<T>[]>,
  get :  (i:number)=>SignalObject<T>,
  add : (v ?: U) => void,
  remove : (index : number) => void,
  getSelectedSignal : ()=>(SignalObject<T> | undefined),
  selectedIndex : SignalObject<number | undefined>,
}