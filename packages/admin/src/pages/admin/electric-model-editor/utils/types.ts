import { Accessor, Resource, Setter } from "solid-js";
import { Position } from "~/commons/interfaces/position";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { GuitarBodySPEnum, guitarBodyContourMediaKey } from "./constant";
import { ImageType } from "~/commons/interfaces/image-type";
import { EntityContext } from "~/commons/interfaces/entity";
import { EntityWithoutBase, Satisfies, ServerEntities } from "stranough-server";
import { KeyOf } from "stranough-server/dist/interfaces/class-key.interface";
import * as Common from 'stranough-common'
import { contourKeys } from "stranough-common/dist/guitar-body";

export interface GuitarModelContextType extends EntityContext<ElectricModel> {}

export type SpawnPointType = {
  isShow : SignalObject<boolean>,
  position : SignalObject<Position | undefined>,
};

export type GuitarBodyTextureMediaKeyType = typeof guitarBodyContourMediaKey[number];

export type GuitarBodyTextureKeyType = typeof Common.GuitarBody.contourKeys[number];

export type GuitarModelBodyKeyType = typeof Common.GuitarModel.bodyKeys[number];

export type ElectricModel = Satisfies<KeyOf<EntityWithoutBase<ServerEntities.ElectricGuitarModel>>, {
  id: SignalObject<number | undefined>;
  name: SignalObject<string | undefined>;
  description: SignalObject<string |undefined>;
  placeholder: {
    name: SignalObject<string>;
    description: SignalObject<string>;
  };
  boltOnBody: SignalObject<GuitarBody | null |undefined>;
  neckThroughBody: SignalObject<GuitarBody | null | undefined>;
  setInBody: SignalObject<GuitarBody | null | undefined>;
  thumbnail : SignalObject<ImageType | null | undefined>;
  price : SignalObject<number>;
  maskScale : SignalObject<number>;
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
      set : Setter<Position | undefined>,
    },
    asArray : ()=>{position : SignalObject<Position | undefined>, rotation ?: SignalObject<number>}[],
    hovered : SignalObject<GuitarBodySPEnum | undefined>,
    fingerboard : SpawnPointType,
    fingerboardBackEnd : SpawnPointType,
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
}>;

type getTopContour<T> = T extends `top${infer T}` ? `top${T}` : never;
type getBackContour<T> = T extends `back${infer T}` ? `back${T}` : never;

export type AvailableTopContour = getTopContour<typeof contourKeys[number]>;
export type AvailableBackContour = getBackContour<typeof contourKeys[number]>;

export type GuitarBody = Satisfies<KeyOf<EntityWithoutBase<ServerEntities.GuitarBody>>, {
  id: SignalObject<number | undefined>;
  selectedContour : Accessor<typeof contourKeys[number] | undefined>;
  selectedTopContour : SignalObject<AvailableTopContour | undefined>;
  selectedBackContour : SignalObject<AvailableBackContour | undefined>;
  mask : SignalObject<ImageType | null | undefined>;
  backMask : SignalObject<ImageType | null | undefined>;
  price : SignalObject<number>;
  burstTop : SignalObject<ImageType | null | undefined>;
  burstBack : SignalObject<ImageType | null | undefined>;
  getSelectedTopContourSignal : () => GuitarBodyContour | null | undefined;
  getSelectedBackContourSignal : () => GuitarBodyContour | null | undefined;
  getSelectedContourSignal : () => GuitarBodyContour | null | undefined;
  backCarvedContour : SignalObject<GuitarBodyContour | null | undefined>;
  backFlatContour : SignalObject<GuitarBodyContour | null | undefined>;
  backTummyContour : SignalObject<GuitarBodyContour | null | undefined>;
  topCarvedContour : SignalObject<GuitarBodyContour | null | undefined>;
  topFlatContour : SignalObject<GuitarBodyContour | null | undefined>;
  topForearmContour : SignalObject<GuitarBodyContour | null | undefined>;
}>

export type GuitarBodyContour = Satisfies<KeyOf<EntityWithoutBase<ServerEntities.GuitarBodyContour>>, {
  id: SignalObject<number | undefined>;
  price: SignalObject<number>;
  shadowTexture: SignalObject<ImageType | null | undefined>;
  specularTexture: SignalObject<ImageType | null | undefined>;
}>;