import { ServerEntities } from "stranough-server";
import { Nut, StringSPType } from "./types";
import { createSignalObject, createSignalObjectArray } from "~/commons/functions/signal-object.util";
import { ImageType } from "~/commons/interfaces/image-type";
import { Position } from "~/commons/interfaces/position";
import { createSignal } from "solid-js";
import { createPixiTextureSignal } from "~/commons/functions/create-pixi-texture-signal";
import { SignalObject } from "~/commons/interfaces/signal-object";

export function createNut(
  b?: ServerEntities.Nut,
  options?: {
    onSave?: (g: Nut) => () => Promise<void>;
  }
): Nut {
  const [texture, setTexture] = createSignal(
    b?.texture && {
      id: b.texture.id,
      // @ts-ignore
      filename: b.texture.filename,
    }
  );
  const stringSpawnPoint = createSignalObjectArray<Position | undefined, Position | undefined>(
    b?.stringSpawnPoint && b.stringSpawnPoint.length > 0
      ? b.stringSpawnPoint
      : Array.from({ length: b?.stringCount ?? 6 }, () => undefined),
    (p) => p,
  );

  const stringCount = createSignalObject(b ? b.stringCount : 6);

  const obj: Nut = {
    id: createSignalObject<number | undefined>(b ? b.id : undefined),
    name: createSignalObject(),
    description: createSignalObject(),
    placeholder: {
      name: createSignalObject(b ? b.name : "Nut Name"),
      description: createSignalObject(b ? b.description : "Nut Description"),
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
    selectedItem: createSignalObject(),
    getSelectedItem: () => {
      switch (obj.selectedItem.get()) {
        case "pivot":
          return obj.pivotPosition;
        case "stringSpawnPoint": {
          return stringSpawnPoint.getSelectedSignal();
        }
        default:
          return undefined;
      }
    },
    stringCount: {
      get: stringCount.get,
      set: (x: number | ((y: number) => void)) => {
        if (typeof x === "function") x(stringCount.get());
        else stringCount.set(x);

        stringSpawnPoint.setState(
          prev => Array.from({ length: stringCount.get() }, (_, i) => prev[i])
        )
      },
    },
    stringSpawnPoint,
  };

  if (options?.onSave) {
    obj.save = options.onSave(obj);
  }

  return obj;
}