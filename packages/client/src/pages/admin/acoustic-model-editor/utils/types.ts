import { Accessor, Resource, Setter} from "solid-js";
import { Satisfies } from "stranough-common/dist/util-types";
import { ServerEntities } from "stranough-server";
import { KeyOf } from "stranough-server/dist/interfaces/class-key.interface";
import { CommonEntity, EntityContext } from "~/commons/interfaces/entity";
import {
  NullableImageTypeSignal,
  ImageTypeSignal,
} from "~/commons/interfaces/image-type-signal";
import { Position } from "~/commons/interfaces/position";
import {
  SignalObject,
} from "~/commons/interfaces/signal-object";
import { SpawnPointType } from "../../electric-model-editor/utils/types";
import { ImageType } from "~/commons/interfaces/image-type";
import { Texture } from "pixi.js";

export interface AcousticGuitarModelContextType extends EntityContext<AcousticGuitarModel> {}

export interface AcousticGuitarModel extends CommonEntity {
  spawnPoints : {
    selected : SignalObject<'bridge' | 'bottomEnd' | 'topEnd' | 'preamp' | undefined>,
    getSelectedSignal : ()=>({
      get : Accessor<Position | undefined>,
      set : Setter<Position | undefined>,
    }) | undefined,
    asArray : ()=>{position : SignalObject<Position | undefined>, rotation ?: SignalObject<number>}[],
    bridge : SpawnPointType,
    topEnd : SpawnPointType,
    bottomEnd : SpawnPointType,
    preamp : SpawnPointType & {rotation : SignalObject<number>},
  },
  mask : Accessor<Texture | undefined>,
  normalFullMask : Accessor<Texture | undefined>,
  selectedCutaway : SignalObject<undefined | 'soft' | 'venetian' | 'florentine'>,
  getSelectedCutawaySignal : ()=>NullableImageTypeSignal | undefined,
  thumbnail : NullableImageTypeSignal,
  maskScale : SignalObject<number>,
  
  isBeveled : SignalObject<boolean>,
  normalMask : NullableImageTypeSignal,
  beveledMask : NullableImageTypeSignal,

  softCutawayMask : NullableImageTypeSignal,
  venetianCutawayMask : NullableImageTypeSignal,
  florentineCutawayMask : NullableImageTypeSignal,

  loadedMask : {
    normalMask : Resource<HTMLImageElement | undefined>,
    beveledMask : Resource<HTMLImageElement | undefined>,

    softCutawayMask : Resource<HTMLImageElement | undefined>,
    venetianCutawayMask : Resource<HTMLImageElement | undefined>,
    florentineCutawayMask : Resource<HTMLImageElement | undefined>,
  }
}
