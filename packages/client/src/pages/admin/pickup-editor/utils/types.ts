import { EntityContext, EntityWithSprite } from "~/commons/interfaces/entity";
import { Pickup as PickupConfig} from "stranough-common";
import {
  SignalObject,
} from "~/commons/interfaces/signal-object";

export interface PickupContextType extends EntityContext<Pickup> {}

export interface Pickup extends EntityWithSprite {
  type : SignalObject<`${PickupConfig.PickupType}` | undefined>;
  stringCount : SignalObject<number>;
}
