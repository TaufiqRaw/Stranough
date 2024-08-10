import { ServerEntities } from "stranough-server";
import { Headstock } from "./types";
import {
  createSignalObject,
  createSignalObjectArray,
} from "~/commons/functions/signal-object.util";
import { ImageType } from "~/commons/interfaces/image-type";
import { PosRotWithFlipped, Position, PositionWithRotation } from "~/commons/interfaces/position";
import { createSignal, onMount } from "solid-js";
import { createPixiTextureSignal } from "~/commons/functions/create-pixi-texture-signal";
import { SignalObject } from "~/commons/interfaces/signal-object";


export function createHeadstock(
  b?: ServerEntities.Headstock,
  options?: {
    onSave?: (g: Headstock) => () => Promise<void>;
  }
): Headstock {
  const [texture, setTexture] = createSignal(
    b?.texture && {
      id: b.texture.id,
      // @ts-ignore
      filename: b.texture.filename,
    }
  );

  const pegsSpawnPoint = createSignalObjectArray<
    | {
        position: SignalObject<Position | undefined>;
        rotation: SignalObject<number | undefined>;
        flipped: SignalObject<boolean | undefined>;
      }
    | undefined,
    PosRotWithFlipped | undefined
  >(
    b?.pegsSpawnPoint && b.pegsSpawnPoint.length > 0
      ? b.pegsSpawnPoint
      : Array.from({ length: b?.stringCount ?? 6 }, () => undefined),
    (p) => ({
      position: createSignalObject(p ? { x: p.x, y: p.y } : undefined),
      rotation: createSignalObject(p?.rotation),
      flipped: createSignalObject(p?.flipped),
    })
  );

  const slottedGuardSpawnPoint = createSignalObjectArray<{
    position : SignalObject<Position | undefined>,
    rotation : SignalObject<number | undefined>,
  } | undefined, PositionWithRotation>(
    b?.slottedGuardSpawnPoint && b.slottedGuardSpawnPoint.length > 0
      ? b.slottedGuardSpawnPoint
      : [],
    (p) => ({
      position: createSignalObject(p ? { x: p.x, y: p.y } : undefined),
      rotation: createSignalObject(p?.rotation),
    })
  ); 

  const stringCount = createSignalObject(b ? b.stringCount : 6);

  const obj: Headstock = {
    id: createSignalObject<number | undefined>(b ? b.id : undefined),
    name: createSignalObject(),
    description: createSignalObject(),
    placeholder: {
      name: createSignalObject(b ? b.name : "Headstock Name"),
      description: createSignalObject(
        b?.description ?? "Headstock Description"
      ),
    },
    thumbnail: createSignalObject<ImageType | null | undefined>(
      b?.thumbnail && {
        id: b.thumbnail.id,
        // @ts-ignore
        filename: b.thumbnail.filename,
      }
    ),
    isSlotted: createSignalObject(b ? b.isSlotted : false),
    texture: createPixiTextureSignal(texture, setTexture),
    pivotPosition: createSignalObject<Position | undefined>(
      b?.pivotPosition ?? { x: 0, y: 0 }
    ),
    price: createSignalObject(b ? b.price : 0),
    scale: createSignalObject(b ? b.scale : 1),
    selectedItem: createSignalObject<any>(undefined),
    getSelectedItem: () => {
      switch (obj.selectedItem.get()) {
        case "pivot":
          return obj.pivotPosition;
        case "pegsSpawnPoint": {
          const pos = obj.pegsSpawnPoint.getSelectedSignal()?.get();
          if(!pos)
            return undefined;
          return {...pos.position, rotation: pos.rotation};
        }
        case "slottedGuardSpawnPoint" : {
          const pos = obj.slottedGuardSpawnPoint.getSelectedSignal()?.get();
          if(!pos)
            return undefined;
          return {...pos.position, rotation: pos.rotation};
        }
        default:
          return undefined;
      }
    },
    slottedGuardSpawnPoint,
    slottedGuardLength: createSignalObject(b?.slottedGuardLength),
    slottedRodOffset: createSignalObject(b?.slottedRodOffset),
    stringCount: {
      get: stringCount.get,
      set: (x: number | ((y: number) => void)) => {
        if (typeof x === "function") x(stringCount.get());
        else stringCount.set(x);

        pegsSpawnPoint.setState((p) =>
          Array.from(
            { length: stringCount.get() },
            (_, i) => p[i] ?? createSignalObject()
          )
        );
      },
    },
    pegsSpawnPoint,
    frontShadowTexture: createSignalObject<ImageType | undefined | null>(
      b?.frontShadowTexture
        ? {
            // @ts-ignore
            id: b.frontShadowTexture.id,
            // @ts-ignore
            filename: b.frontShadowTexture.filename,
          }
        : undefined
    ),
    backShadowTexture: createSignalObject<ImageType | undefined | null>(
      b?.backShadowTexture
        ? {
            // @ts-ignore
            id: b.backShadowTexture.id,
            // @ts-ignore
            filename: b.backShadowTexture.filename,
          }
        : undefined
    ),
  };

  if (options?.onSave) {
    obj.save = options.onSave(obj);
  }

  return obj;
}
