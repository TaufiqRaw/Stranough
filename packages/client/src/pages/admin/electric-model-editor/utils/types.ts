import { Accessor, Resource, Setter } from "solid-js";
import { Position } from "~/commons/interfaces/position";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { ImageType } from "~/commons/interfaces/image-type";
import { EntityContext } from "~/commons/interfaces/entity";
import { EntityWithoutBase, Satisfies, ServerEntities } from "stranough-server";
import { KeyOf } from "stranough-server/dist/interfaces/class-key.interface";
import {ElectricModel} from "stranough-common"

export type SelectableElectricModelComponents = 'fingerboard' | 'fingerboardBackEnd' | 'bridge' | 'switch' | 'jackSide' | 'jackTop' | 'pickupNeck' | 'pickupMiddle' | 'pickupBridge' | 'knobs' | 'pickguard';

export interface GuitarModelContextType extends EntityContext<ElectricModel> {}

export type SpawnPointType = {
  isShow : SignalObject<boolean>,
  position : SignalObject<Position | undefined>,
};
export type ElectricModel = Satisfies<KeyOf<EntityWithoutBase<ServerEntities.ElectricGuitarModel>>, {
  id: SignalObject<number | undefined>;
  name: SignalObject<string | undefined>;
  description: SignalObject<string |undefined>;
  placeholder: {
    name: SignalObject<string>;
    description: SignalObject<string>;
  };
  boltOnConstruction: {
    mask : SignalObject<ImageType | null | undefined>;
  }
  neckThroughConstruction: {
    mask : SignalObject<ImageType | null | undefined>;
  }
  setInConstruction: {
    mask : SignalObject<ImageType | null | undefined>;
  }
  flatContour : {
    shadow : SignalObject<ImageType | null | undefined>;
    spec : SignalObject<ImageType | null | undefined>;
  }
  forearmContour : {
    shadow : SignalObject<ImageType | null | undefined>;
    spec : SignalObject<ImageType | null | undefined>;
  }
  tummyContour : {
    shadow : SignalObject<ImageType | null | undefined>;
    spec : SignalObject<ImageType | null | undefined>;
  }
  carvedContour : {
    shadow : SignalObject<ImageType | null | undefined>;
    spec : SignalObject<ImageType | null | undefined>;
  }
  thumbnail : SignalObject<ImageType | null | undefined>;
  price : SignalObject<number>;
  maskScale : SignalObject<number>;
  save ?: ()=> Promise<void>;

  selectedConstruction : SignalObject< typeof ElectricModel.constructionKeys[number] | undefined>;
  getSelectedConstructionSignal : () => ({
    mask : SignalObject<ImageType | null | undefined>,
  } | undefined);

  selectedTopContour : SignalObject<Exclude<typeof ElectricModel.contourKeys[number], 'tummyContour'> | undefined>;
  getSelectedTopContourSignal : () => {
    shadow : SignalObject<ImageType | null | undefined>,
    spec : SignalObject<ImageType | null | undefined>,
  } | null | undefined;

  selectedBackContour : SignalObject<Exclude<typeof ElectricModel.contourKeys[number], "forearmContour"> | undefined>;
  getSelectedBackContourSignal : () => {
    shadow : SignalObject<ImageType | null | undefined>,
    spec : SignalObject<ImageType | null | undefined>,
  } | null | undefined;

  spawnPoints : {
    selected : SignalObject<SelectableElectricModelComponents | undefined>,
    getSelectedSignal : ()=>({
      get : Accessor<Position | undefined>,
      set : Setter<Position | undefined>,
    } | undefined),
    asArray : ()=>{position : SignalObject<Position | undefined>, rotation ?: SignalObject<number>}[],
    hovered : SignalObject<SelectableElectricModelComponents | undefined>,
    fingerboard : SpawnPointType,
    fingerboardBackEnd : SpawnPointType,
    bridge : SpawnPointType,
    switch : SpawnPointType & {rotation : SignalObject<number>},
    jack : {
      side : SpawnPointType & {rotation : SignalObject<number>},
      top : SpawnPointType & {rotation : SignalObject<number>},
    }, 
    pickguard : SpawnPointType,
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