import { ServerEntities } from "stranough-server";
import { Pickup } from "./types";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { ImageType } from "~/commons/interfaces/image-type";
import { Position } from "~/commons/interfaces/position";
import { createSignal } from "solid-js";
import { createPixiTextureSignal } from "~/commons/functions/create-pixi-texture-signal";
import { Pickup as PickupConfig } from "stranough-common";

export function createPickup(
  b?: ServerEntities.Pickup,
  options?: {
    onSave?: (g: Pickup) => () => Promise<void>;
  }
): Pickup {
  const [texture, setTexture] = createSignal(
    b?.texture && {
      id: b.texture.id,
      // @ts-ignore
      filename: b.texture.filename,
    }
  );

  const obj: Pickup = {
    id: createSignalObject<number | undefined>(b ? b.id : undefined),
    name: createSignalObject(),
    description: createSignalObject(),
    placeholder: {
      name: createSignalObject(b ? b.name : "Pickup Name"),
      description: createSignalObject(b ? b.description : "Pickup Description"),
    },
    thumbnail: createSignalObject<ImageType | null | undefined>(
      b?.thumbnail && {
        id: b.thumbnail.id,
        // @ts-ignore
        filename: b.thumbnail.filename,
      }
    ),
    texture: createPixiTextureSignal(texture, setTexture),
    pivotPosition: createSignalObject<Position | undefined>(
      b?.pivotPosition ?? { x: 0, y: 0 }
    ),
    price: createSignalObject(b ? b.price : 0),
    scale: createSignalObject(b ? b.scale : 1),
    type: createSignalObject(b ? b.type as `${PickupConfig.PickupType}` : undefined),
    selectedItem: createSignalObject<'pivot'>(),
    getSelectedItem: () => {
      switch (obj.selectedItem.get()) {
        case "pivot":
          return obj.pivotPosition;
        default:
          return undefined;
      }
    },
    stringCount: createSignalObject(b ? b.stringCount : 6),
  };

  if (options?.onSave) {
    obj.save = options.onSave(obj);
  }

  return obj;
}
