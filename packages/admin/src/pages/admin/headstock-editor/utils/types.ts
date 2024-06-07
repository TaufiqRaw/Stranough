import { EntityContext, EntityWithSprite } from "~/commons/interfaces/entity";
import { ImageType } from "~/commons/interfaces/image-type";
import { Position, PositionWithRotation } from "~/commons/interfaces/position";
import {
  SignalObject,
  SignalObjectArray,
} from "~/commons/interfaces/signal-object";

export interface HeadstockContextType extends EntityContext<Headstock> {}

export interface Headstock extends EntityWithSprite<"pegsSpawnPoint"> {
  stringCount: SignalObject<number>;
  pegsSpawnPoint: SignalObjectArray<{
    position : SignalObject<Position | undefined>,
    rotation : SignalObject<number | undefined>
  } | undefined, PositionWithRotation>;
  frontShadowTexture: SignalObject<ImageType | undefined | null>;
  backShadowTexture: SignalObject<ImageType | undefined | null>;
  save?: () => Promise<void>;
}
