import { Accessor, Setter} from "solid-js";
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

export interface AcousticGuitarModelContextType extends EntityContext<AcousticGuitarModel> {}

export interface AcousticGuitarModel extends CommonEntity {
  spawnPoints : {
    selected : SignalObject<'fingerboard' | 'fingerboardBackEnd' | 'bridge' | 'jack' | undefined>,
    getSelectedSignal : ()=>({
      get : Accessor<Position | undefined>,
      set : Setter<Position | undefined>,
    }) | undefined,
    asArray : ()=>{position : SignalObject<Position | undefined>, rotation ?: SignalObject<number>}[],
    fingerboard : SpawnPointType,
    fingerboardBackEnd : SpawnPointType,
    bridge : SpawnPointType,
    jack : SpawnPointType & {rotation : SignalObject<number>},
  },
  selectedCutaway : SignalObject<undefined | 'soft' | 'venetian' | 'florentine'>,
  getSelectedCutawaySignal : ()=>NullableImageTypeSignal,
  getSelectedCutawayBurstSignal : ()=>NullableImageTypeSignal,
  thumbnail : NullableImageTypeSignal,
  maskScale : SignalObject<number>,
  noneCutawayMask : NullableImageTypeSignal,
  softCutawayMask : NullableImageTypeSignal,
  venetianCutawayMask : NullableImageTypeSignal,
  florentineCutawayMask : NullableImageTypeSignal,
  noneCutawayBurst : NullableImageTypeSignal,
  softCutawayBurst : NullableImageTypeSignal,
  venetianCutawayBurst : NullableImageTypeSignal,
  florentineCutawayBurst : NullableImageTypeSignal,
}
