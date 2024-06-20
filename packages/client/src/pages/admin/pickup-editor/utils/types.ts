import { Accessor} from "solid-js";
import { ServerEntities } from "stranough-server";
import { GuitarPickupType } from "stranough-server/dist/enums";
import { EntityContext, EntityWithSprite } from "~/commons/interfaces/entity";
import {
  NullableImageTypeSignal,
  ImageTypeSignal,
} from "~/commons/interfaces/image-type-signal";
import { Position } from "~/commons/interfaces/position";
import {
  SignalObject,
} from "~/commons/interfaces/signal-object";

export interface PickupContextType extends EntityContext<Pickup> {}

export interface Pickup extends EntityWithSprite {
  type : SignalObject<`${GuitarPickupType}` | undefined>;
  stringCount : SignalObject<number>;
}
