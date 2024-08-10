import { Accessor} from "solid-js";
import { EntityContext, EntityWithSprite } from "~/commons/interfaces/entity";
import {
  NullableImageTypeSignal,
  ImageTypeSignal,
} from "~/commons/interfaces/image-type-signal";
import { Position } from "~/commons/interfaces/position";
import {
  SignalObject,
  SignalObjectArray,
} from "~/commons/interfaces/signal-object";

export interface NutContextType extends EntityContext<Nut> {}

export type StringSPType = {
  state: Accessor<SignalObject<Position | undefined>[]>;
  get: (i: number) => SignalObject<Position | undefined> | undefined;
};

export interface Nut extends EntityWithSprite<"stringSpawnPoint"> {
  stringCount: SignalObject<number>;
  isBass: SignalObject<boolean>;
  headlessOnly: SignalObject<boolean>;

  stringSpawnPoint: SignalObjectArray<Position | undefined, Position | undefined>;
}
