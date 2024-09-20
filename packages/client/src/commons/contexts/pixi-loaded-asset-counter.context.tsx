import { ReactiveMap } from "@solid-primitives/map";
import { useLocation } from "@solidjs/router";
import { JSX, createContext, createEffect, useContext } from "solid-js";

type LoadedAssetCounter = {
  get(key : string) : number;
  increment(key : string) : void;
  decrement(key : string) : boolean;
}

const PixiLoadedAssetContext = createContext<LoadedAssetCounter>({} as LoadedAssetCounter);

export function PixiLoadedAssetProvider(props : {children : JSX.Element}){
  const counter = new ReactiveMap<string, number>();

  function get(key : string){
    return counter.get(key) ?? 0;
  }
  function increment(key : string){
    counter.set(key, (counter.get(key) ?? 0) + 1);
  }
  // returns true if the key is now 0
  // or if the key is not in the map
  function decrement(key : string){
    const val = counter.get(key);
    if(val === 1) counter.delete(key);
    else if(val) counter.set(key, val - 1);
    return val === 1 || !val; 
  }
  createEffect(()=>console.log('assets referenc counter = ', counter.size))
  return <PixiLoadedAssetContext.Provider value={{get, increment, decrement}}>
    {props.children}
  </PixiLoadedAssetContext.Provider>
} 

export function usePixiLoadedAssetCounter(){
  return useContext(PixiLoadedAssetContext)!;
}
