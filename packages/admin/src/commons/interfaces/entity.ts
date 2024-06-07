import { ImageTypeSignal, NullableImageTypeSignal } from "./image-type-signal";
import { Position, PositionWithRotation } from "./position";
import { SignalObject } from "./signal-object";
import { Resource } from "solid-js";

export interface CommonEntity {
  id: SignalObject<number | undefined>;
  name: SignalObject<string | undefined>;
  description: SignalObject<string | undefined>;
  placeholder: {
    name: SignalObject<string>;
    description: SignalObject<string>;
  };
  price: SignalObject<number>;
  save?: () => Promise<void>;
}

export interface EntityWithSprite<T = undefined> extends CommonEntity {
  thumbnail: NullableImageTypeSignal;
  scale: SignalObject<number>;
  texture: ImageTypeSignal;
  pivotPosition: SignalObject<Position | undefined>;
  selectedItem: SignalObject<"pivot" | T | undefined>;
  getSelectedItem: () => SignalObject<PositionWithRotation | undefined> | undefined;
}

export interface EntityContext<T> {
  get : Resource<T | undefined>,
  load : (id : number | undefined)=>void
}