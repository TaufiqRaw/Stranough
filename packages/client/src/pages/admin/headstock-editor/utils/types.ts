import { EntityContext, EntityWithSprite } from "~/commons/interfaces/entity";
import { ImageType } from "~/commons/interfaces/image-type";
import { PosRotWithFlipped, Position, PositionWithRotation } from "~/commons/interfaces/position";
import {
  SignalObject,
  SignalObjectArray,
} from "~/commons/interfaces/signal-object";

export interface HeadstockContextType extends EntityContext<Headstock> {}

export interface Headstock extends EntityWithSprite<"pegsSpawnPoint" | "slottedGuardSpawnPoint"> {
  isSlotted: SignalObject<boolean>;
  stringCount: SignalObject<number>;
  pegsSpawnPoint: SignalObjectArray<{
    position : SignalObject<Position | undefined>,
    rotation : SignalObject<number | undefined>,
    flipped : SignalObject<boolean | undefined>,
  } | undefined, PosRotWithFlipped>;
  frontShadowTexture: SignalObject<ImageType | undefined | null>;
  backShadowTexture: SignalObject<ImageType | undefined | null>;

  slottedRodOffset: SignalObject<number | undefined>;
  slottedGuardLength: SignalObject<number | undefined>;
  slottedGuardSpawnPoint : SignalObjectArray<{
    position : SignalObject<Position | undefined>,
    rotation : SignalObject<number | undefined>,
  } | undefined, PositionWithRotation>;

  save?: () => Promise<void>;
  
}
