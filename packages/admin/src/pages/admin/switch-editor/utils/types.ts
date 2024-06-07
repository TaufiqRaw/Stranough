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

export interface SwitchContextType extends EntityContext<Switch> {}

export interface Switch extends EntityWithSprite {}
