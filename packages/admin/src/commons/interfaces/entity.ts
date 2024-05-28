import { ImageTypeSignal, NullableImageTypeSignal } from "./image-type-signal";
import { Position } from "./position";
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
}

export interface EntityWithSprite<T = undefined> extends CommonEntity {
  thumbnail: NullableImageTypeSignal;
  scale: SignalObject<number>;
  texture: ImageTypeSignal;
  pivotPosition: SignalObject<Position | undefined>;
  save?: () => Promise<void>;
  selectedItem: SignalObject<"pivot" | T | undefined>;
  getSelectedItem: () => SignalObject<Position | undefined> | undefined;
}

export interface EntityContext<T> {
  get : Resource<T | undefined>,
  load : (id : number | undefined)=>void
}