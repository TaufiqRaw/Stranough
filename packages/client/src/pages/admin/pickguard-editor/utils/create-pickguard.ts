import { ServerEntities } from "stranough-server";
import { Pickguard } from "./types";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { ImageType } from "~/commons/interfaces/image-type";
import { Position } from "~/commons/interfaces/position";
import { createSignal } from "solid-js";
import { createPixiTextureSignal } from "~/commons/functions/create-pixi-texture-signal";

export function createPickguard(
  b?: ServerEntities.Pickguard,
  options?: {
    onSave?: (g: Pickguard) => () => Promise<void>;
  }
): Pickguard {
  const [texture, setTexture] = createSignal(
    b?.texture && {
      id: b.texture.id,
      // @ts-ignore
      filename: b.texture.filename,
    }
  );

  const obj: Pickguard = {
    id: createSignalObject<number | undefined>(b ? b.id : undefined),
    name: createSignalObject(),
    description: createSignalObject(),
    placeholder: {
      name: createSignalObject(b ? b.name : "Pickguard Name"),
      description: createSignalObject(b ? b.description : "Pickguard Description"),
    },
    texture: createPixiTextureSignal(texture, setTexture),
    pivotPosition: createSignalObject<Position | undefined>(
      b?.pivotPosition ?? { x: 0, y: 0 }
    ),
    price: createSignalObject(b ? b.price : 0),
    scale: createSignalObject(b ? b.scale : 1),
    selectedItem: createSignalObject<'pivot'>(),
    // @ts-ignore
    model : createSignalObject(b ? b.model : undefined),
    getSelectedItem: () => {
      switch (obj.selectedItem.get()) {
        case "pivot":
          return obj.pivotPosition;
        default:
          return undefined;
      }
    },
  };

  if (options?.onSave) {
    obj.save = options.onSave(obj);
  }

  return obj;
}
