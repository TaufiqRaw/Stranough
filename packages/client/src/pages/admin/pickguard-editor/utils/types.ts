import { Accessor} from "solid-js";
import { PickguardConfig } from "stranough-common";
import { ServerEntities } from "stranough-server";
import { CommonEntity, EntityContext, EntityWithSprite } from "~/commons/interfaces/entity";
import {
  NullableImageTypeSignal,
  ImageTypeSignal,
} from "~/commons/interfaces/image-type-signal";
import { Position, PositionWithRotation } from "~/commons/interfaces/position";
import {
  SignalObject,
} from "~/commons/interfaces/signal-object";

export interface PickguardContextType extends EntityContext<Pickguard> {}

export interface Pickguard extends CommonEntity {
  model : SignalObject<number | undefined>;
  scale: SignalObject<number>;
  texture: ImageTypeSignal;
  pivotPosition: SignalObject<Position | undefined>;
  type : SignalObject<`${PickguardConfig.PickguardType}` | undefined>;
  selectedItem: SignalObject<"pivot" | undefined>;
  getSelectedItem: () => SignalObject<PositionWithRotation | undefined> | undefined;
}
