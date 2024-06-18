import { Accessor} from "solid-js";
import { ServerEntities } from "stranough-server";
import { CommonEntity, EntityContext, EntityWithSprite } from "~/commons/interfaces/entity";
import {
  NullableImageTypeSignal,
  ImageTypeSignal,
} from "~/commons/interfaces/image-type-signal";
import { Position } from "~/commons/interfaces/position";
import {
  SignalObject,
} from "~/commons/interfaces/signal-object";

export interface PickguardContextType extends EntityContext<Pickguard> {}

export interface Pickguard extends CommonEntity {
  model : SignalObject<number | undefined>;
  texture: ImageTypeSignal;
}
