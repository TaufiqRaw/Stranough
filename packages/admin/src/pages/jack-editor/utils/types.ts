import { Accessor} from "solid-js";
import { ServerEntities } from "stranough-server";
import { EntityContext, EntityWithSprite } from "~/commons/interfaces/entity";
import {
  NullableImageTypeSignal,
  ImageTypeSignal,
} from "~/commons/interfaces/image-type-signal";
import { Position } from "~/commons/interfaces/position";
import {
  SignalObject,
} from "~/commons/interfaces/signal-object";

export interface JackContextType extends EntityContext<Jack> {}

export interface Jack extends EntityWithSprite {
  isSide : SignalObject<boolean>;
}
