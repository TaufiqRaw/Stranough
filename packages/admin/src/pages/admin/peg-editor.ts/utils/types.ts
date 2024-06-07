import { Accessor} from "solid-js";
import { ServerEntities } from "stranough-server";
import { PositionWithRotation } from "stranough-server/dist/interfaces/position.interface";
import { CommonEntity, EntityContext, EntityWithSprite } from "~/commons/interfaces/entity";
import { ImageType } from "~/commons/interfaces/image-type";
import {
  NullableImageTypeSignal,
  ImageTypeSignal,
} from "~/commons/interfaces/image-type-signal";
import { Position } from "~/commons/interfaces/position";
import {
  SignalObject,
} from "~/commons/interfaces/signal-object";

export interface PegContextType extends EntityContext<Peg> {}

export interface Peg extends CommonEntity {
  thumbnail: NullableImageTypeSignal;
  selectedItem: SignalObject<"pegBackPivot" | "pivot" | undefined>;
  getSelectedItem: () => SignalObject<Position | undefined> | undefined;
  pegCapTexture : SignalObject<ImageType | undefined>;
  pegBackTexture : SignalObject<ImageType | undefined>;
  pegBackPivotPosition : SignalObject<Position | undefined>;
  pivotPosition : SignalObject<Position | undefined>;
  scale : SignalObject<number>;
}
