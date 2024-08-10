import { Accessor} from "solid-js";
import { Bridge as BridgeConfig, Pickup as PickupConfig } from "stranough-common";
import { EntityContext } from "~/commons/interfaces/entity";
import {
  NullableImageTypeSignal,
  ImageTypeSignal,
} from "~/commons/interfaces/image-type-signal";
import { Position, PositionWithRotation } from "~/commons/interfaces/position";
import {
  CustomSetterFunctionableSignalObject,
  SignalObject,
  SignalObjectArray,
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
  bottomPoint: CustomSetterFunctionableSignalObject<Position | undefined>;

  isTremolo: SignalObject<boolean>;
  isBass: SignalObject<boolean>;
  headless: SignalObject<boolean>;
  multiscale: SignalObject<boolean>;
  stringCount: SignalObject<number>;
  supportedPickup : SignalObject<`${PickupConfig.PickupType}` | undefined>;
  type : CustomSetterFunctionableSignalObject<`${BridgeConfig.BridgeType}` | undefined>;
  pickupSpawnPoint: SignalObject<PositionWithRotation | undefined>;
  extendable: SignalObject<boolean>;

  selectedItem: SignalObject<"pivot" | "stringSpawnPoint" | "pickupSpawnPoint" | "bottomPoint" | undefined>;
  getSelectedItem: () => CustomSetterFunctionableSignalObject<Position | undefined> | undefined;
  stringSpawnPoint: SignalObjectArray<{
    position : SignalObject<Position | undefined>,
  } | undefined, Position>;

  save?: () => Promise<void>;
}
