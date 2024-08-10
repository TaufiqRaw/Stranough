import {Accessor, Setter, Signal, createSignal} from 'solid-js'

export interface SignalObject<T>{
  get : Accessor<T>,
  set : Setter<T>
}

export interface CustomSetterSignalObject<T>{
  get : Accessor<T>,
  set : (v : T)=>void
}

export interface CustomSetterFunctionableSignalObject<T>{
  get : Accessor<T>,
  set : (v : T | ((p : T)=>T) | undefined)=>void,
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