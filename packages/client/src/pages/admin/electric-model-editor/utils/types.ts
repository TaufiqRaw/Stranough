import { Accessor, Resource, ResourceReturn, Setter } from "solid-js";
import { Position } from "~/commons/interfaces/position";
import { CustomSetterFunctionableSignalObject, CustomSetterSignalObject, SignalObject } from "~/commons/interfaces/signal-object";
import { ImageType } from "~/commons/interfaces/image-type";
import { EntityContext } from "~/commons/interfaces/entity";
import { EntityWithoutBase, Satisfies, ServerEntities } from "stranough-server";
import { KeyOf } from "stranough-server/dist/interfaces/class-key.interface";
import {ElectricModel} from "stranough-common"
import { Texture } from "pixi.js";
import { Pickguard } from "../../pickguard-editor/utils/types";

export type SelectableElectricModelComponents = 'bridge' | 'switch' | 'jackSide' | 'jackTop' | 'knobs' | 'topEnd' | 'bottomEnd' | 'logo' | 'soundHoleLeft' | 'soundHoleRight' | 'electronicCover' | 'minorElectronicCover' | 'batteryCover' | 'bottomHeadless';

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

  mask : CustomSetterFunctionableSignalObject<ImageType | null | undefined>;
  maskScale : SignalObject<number>;
  thumbnail : SignalObject<ImageType | null | undefined>;
  price : SignalObject<number>;
  soundHoleScale : SignalObject<number>;
  mirrorSoundHole : SignalObject<boolean>;
  isBass : SignalObject<boolean>;

  maskBordersPoints : Resource<Position[] | undefined>;
  leftMostPoint : Accessor<Position | undefined>;
  
  flatContourOverlay : SignalObject<ImageType | null | undefined>;
  forearmContourOverlay : SignalObject<ImageType | null | undefined>;
  tummyContourOverlay : SignalObject<ImageType | null | undefined>;
  carvedContourOverlay : SignalObject<ImageType | null | undefined>;

  save ?: ()=> Promise<void>;

  selectedConstruction : SignalObject< typeof ElectricModel.constructionKeys[number] | undefined>;

  selectedTopContour : SignalObject<typeof ElectricModel.topContourKeys[number] | undefined>;
  getSelectedTopContourSignal : () => SignalObject<ImageType | null | undefined> | null | undefined;

  selectedBackContour : SignalObject<typeof ElectricModel.backContourKeys[number] | undefined>;
  getSelectedBackContourSignal : () => SignalObject<ImageType | null | undefined> | null | undefined;

  electronicCoverOverlay : SignalObject<ImageType | null | undefined>;
  bridgeToBottom : SignalObject<number>;

  selectedPickguard : SignalObject<Pickguard | undefined>;

  spawnPoints : {
    selected : SignalObject<SelectableElectricModelComponents | undefined>,
    getSelectedSignal : ()=>(CustomSetterFunctionableSignalObject<Position | undefined> | undefined),
    asArray : ()=>{position : SignalObject<Position | undefined>, rotation ?: SignalObject<number>}[],
    hovered : SignalObject<SelectableElectricModelComponents | undefined>,
    
    soundHoleLeft : SpawnPointType & {rotation : SignalObject<number>},
    soundHoleRight : SpawnPointType & {rotation : SignalObject<number>},
    electronicCover : SpawnPointType & {rotation : SignalObject<number>},
    minorElectronicCover : SpawnPointType & {rotation : SignalObject<number>},
    batteryCover : SpawnPointType & {rotation : SignalObject<number>},
    logo : SpawnPointType & {rotation : SignalObject<number>},

    bridge : SpawnPointType,
    switch : SpawnPointType & {rotation : SignalObject<number>},
    top : SpawnPointType; // top of the guitar body
    bottom : SpawnPointType; // bottom of the guitar body
    jack : {
      side : SpawnPointType & {rotation : SignalObject<number>},
      top : SpawnPointType & {rotation : SignalObject<number>},
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