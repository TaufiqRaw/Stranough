import {Accessor, Setter, Signal, createSignal} from 'solid-js'

export interface SignalObject<T>{
  get : Accessor<T>,
  set : Setter<T>
}