import { Accessor, Resource } from "solid-js";
import { Position } from "~/commons/interfaces/position";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { GuitarBodySPEnum, guitarBodyTextureKey, guitarBodyTextureMediaKey, guitarModelBodyKey } from "./constant";
import { ImageType } from "~/commons/interfaces/image-type";
import { EntityContext } from "~/commons/interfaces/entity";

export interface GuitarModelContextType extends EntityContext<GuitarModel> {}

export type SpawnPointType = {
  isShow : SignalObject<boolean>,
  position : SignalObject<Position | undefined>,
};

export type GuitarBodyTextureMediaKeyType = typeof guitarBodyTextureMediaKey[number];

export type GuitarBodyTextureKeyType = typeof guitarBodyTextureKey[number];

export type GuitarModelBodyKeyType = typeof guitarModelBodyKey[number];

export interface GuitarModel {
  id: SignalObject<number | undefined>;
  name: SignalObject<string>;
  description: SignalObject<string>;
  boltOnBody: SignalObject<GuitarBody | null |undefined>;
  neckThroughBody: SignalObject<GuitarBody | null | undefined>;
  setInBody: SignalObject<GuitarBody | null | undefined>;
  thumbnail : SignalObject<ImageType | null | undefined>;
  allowSingleCoilPickup : SignalObject<boolean>;
  save ?: ()=> Promise<void>;
  selectedBody : {
    get : Accessor<GuitarModelBodyKeyType | null | undefined>,
    set : (x ?: GuitarModelBodyKeyType)=>void,
  };
  getSelectedBodySignal : () => GuitarBody | null | undefined;
  spawnPoints : {
    selected : SignalObject<GuitarBodySPEnum | undefined>,
    getSelectedSignal : ()=>{
      get : Accessor<Position | undefined>,
      set : (x : Position)=>void,
    },
    asArray : ()=>{position : SignalObject<Position | undefined>, rotation ?: SignalObject<number>}[],
    hovered : SignalObject<GuitarBodySPEnum | undefined>,
    fingerboard : SpawnPointType,
    bridge : SpawnPointType,
    switch : SpawnPointType & {rotation : SignalObject<number>},
    jack : {
      side : SpawnPointType & {rotation : SignalObject<number>},
      top : SpawnPointType & {rotation : SignalObject<number>},
    }, 
    pickup : {
      neck : SpawnPointType,
      middle : SpawnPointType,
      bridge : SpawnPointType,
      remove : (name : 'neck' | 'middle' | 'bridge') => void,
    },
    knobs : {
      get :  Accessor<SignalObject<Position | undefined>[]>,
      addKnobs : () => void,
      removeKnobs : (index : number) => void,
      selectedKnobIndex : SignalObject<number | undefined>,
    }
  };
  // pickguards: Collection<Pickguard, object>;
  // headstocks: Collection<Headstock, object>;
}

export interface GuitarBody {
  id: SignalObject<number | undefined>;
  selectedBodyTexture: {
    get : Accessor<GuitarBodyTextureKeyType | undefined>,
    set : (x ?: GuitarBodyTextureKeyType)=>void,
  },
  mask : SignalObject<ImageType | null | undefined>;
  maskScale : SignalObject<number>;
  getSelectedBodyTextureSignal : () => GuitarBodyTexture | null | undefined;
  flatTopBackTexture: SignalObject<GuitarBodyTexture | null | undefined>;
  forearmCutTexture: SignalObject<GuitarBodyTexture | null | undefined>;
  tummyCutTexture: SignalObject<GuitarBodyTexture | null | undefined>;
  forearmTummyCutTexture: SignalObject<GuitarBodyTexture | null | undefined>;
  carvedTopTexture: SignalObject<GuitarBodyTexture | null | undefined>;
  carvedTopBackTexture: SignalObject<GuitarBodyTexture | null | undefined>;
  carvedTopTummyCutTexture: SignalObject<GuitarBodyTexture | null | undefined>;
}

export interface GuitarBodyTexture {
  id: SignalObject<number | undefined>;
  scale: SignalObject<number>;
  frontHoleMask: {get : Accessor<ImageType | null | undefined>, set : (x : ImageType | null | undefined)=>void};
  mask: {get : Accessor<ImageType | null | undefined>, set : (x : ImageType | null | undefined)=>void};
  backMask: {get : Accessor<ImageType | null | undefined>, set : (x : ImageType | null | undefined)=>void};
  frontShadowTexture: {get : Accessor<ImageType | null | undefined>, set : (x : ImageType | null | undefined)=>void};
  backShadowTexture: {get : Accessor<ImageType | null | undefined>, set : (x : ImageType | null | undefined)=>void};
  frontSpecularTexture: {get : Accessor<ImageType | null | undefined>, set : (x : ImageType | null | undefined)=>void};
  backSpecularTexture: {get : Accessor<ImageType | null | undefined>, set : (x : ImageType | null | undefined)=>void};
}