import { Texture } from "pixi.js";
import { Accessor, Setter, Signal, batch, createContext, createSignal, useContext } from "solid-js";
import { SignalObjectUtil } from "~/utils/functions/signalObjectUtil";
import { Position } from "~/utils/interfaces/Position";
import { SignalObject } from "~/utils/interfaces/SignalObject";

export type SpawnPointType = SignalObject<Position | undefined>;

export enum GuitarBodySPEnum {
  fingerboard = 1, pickguard, bridge, switch, jackSide, jackTop, pickupNeck , pickupMiddle, pickupBridge, knobs
}

export interface GuitarBodyState {
  texture : {
      isLoading : SignalObject<boolean>,
  } & SignalObject<Texture | undefined>,
  shadow : {
    isLoading : SignalObject<boolean>,
  } & SignalObject<Texture | undefined>,
  spawnPoints : {
    selected : SignalObject<GuitarBodySPEnum | undefined>,
    hovered : SignalObject<GuitarBodySPEnum | undefined>,
    fingerboard : SpawnPointType,
    pickguard : SpawnPointType,
    bridge : SpawnPointType,
    switch : SpawnPointType,
    jack : {
      side : SpawnPointType,
      top : SpawnPointType
    }, 
    pickup : {
      neck : SpawnPointType,
      middle : SpawnPointType,
      bridge : SpawnPointType
    },
    knobs : {
      get :  Accessor<SignalObject<Position>[]>,
      addKnobs : (knobs : Position) => void,
      removeKnobs : (index : number) => void,
      selectedKnobIndex : SignalObject<number | undefined>,
    }
  }
}

const GuitarBodyStateContext = createContext<GuitarBodyState>();

export function GuitarBodyStateProvider(props : any){
  const [knobs, setKnobs] = createSignal<SignalObject<Position>[]>([]);
  const selectedKnobIndex = SignalObjectUtil.create<number>();

  const guitarConfig : GuitarBodyState = {
    texture : {
      ...SignalObjectUtil.create<Texture>(),
      isLoading : SignalObjectUtil.create(false)
    },
    shadow : {
      ...SignalObjectUtil.create<Texture>(),
      isLoading : SignalObjectUtil.create(false)
    },
    spawnPoints : {
      selected : SignalObjectUtil.create<GuitarBodySPEnum>(),
      hovered : SignalObjectUtil.create<GuitarBodySPEnum>(),
      fingerboard : SignalObjectUtil.create<Position>(),
      bridge : SignalObjectUtil.create<Position>(),
      jack : {
        side : SignalObjectUtil.create<Position>(),
        top : SignalObjectUtil.create<Position>()
      },
      pickguard : SignalObjectUtil.create<Position>(),
      switch : SignalObjectUtil.create<Position>(),
      pickup : {
        neck : SignalObjectUtil.create<Position>(),
        middle : SignalObjectUtil.create<Position>(),
        bridge : SignalObjectUtil.create<Position>()
      },
      knobs : {
        get : knobs,
        addKnobs(k : Position){
          setKnobs([...knobs(), SignalObjectUtil.create(k)]);
        },
        removeKnobs(i : number){
          batch(()=>{
            setKnobs(knobs().filter((_, index) => index !== i));
            selectedKnobIndex.set(undefined);
          })
        },
        selectedKnobIndex
      },
    }
  }
  
  return <GuitarBodyStateContext.Provider value={guitarConfig}>
    {props.children}
  </GuitarBodyStateContext.Provider>
} 

export function useGuitarBodyState(){
  return useContext(GuitarBodyStateContext)!;
}