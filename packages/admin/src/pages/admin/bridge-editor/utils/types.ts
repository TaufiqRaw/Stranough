import { Accessor} from "solid-js";
import { EntityContext } from "~/commons/interfaces/entity";
import {
  NullableImageTypeSignal,
  ImageTypeSignal,
} from "~/commons/interfaces/image-type-signal";
import { Position } from "~/commons/interfaces/position";
import {
  SignalObject,
} from "~/commons/interfaces/signal-object";

export interface BridgeContextType extends EntityContext<Bridge> {}

export type StringSPType = {
  state: Accessor<SignalObject<Position | undefined>[]>;
  get: (i: number) => SignalObject<Position | undefined> | undefined;
};

export interface Bridge {
  id: SignalObject<number | undefined>;
  name: SignalObject<string | undefined>;
  description: SignalObject<string | undefined>;
  placeholder: {
    name: SignalObject<string>;
    description: SignalObject<string>;
  };
  thumbnail: NullableImageTypeSignal;
  price: SignalObject<number>;
  scale: SignalObject<number>;
  texture: ImageTypeSignal;
  pivotPosition: SignalObject<Position | undefined>;
  stringCount: SignalObject<number>;
  selectedItem: SignalObject<"pivot" | "stringSpawnPoint" | undefined>;
  getSelectedItem: () => SignalObject<Position | undefined> | undefined;
  stringSpawnPoint: {
    state: Accessor<StringSPType[]>;
    get: (i: number) => StringSPType | undefined;
    add: () => void;
    remove: (index: number) => void;
    selectedIndex: SignalObject<[number, number] | undefined>;
  };
  save?: () => Promise<void>;
}
