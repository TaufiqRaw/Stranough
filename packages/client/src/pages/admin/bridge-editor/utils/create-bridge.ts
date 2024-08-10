import { ServerEntities } from "stranough-server";
import { Bridge, StringSPType } from "./types";
import { createSignalObject, createSignalObjectArray } from "~/commons/functions/signal-object.util";
import { ImageType } from "~/commons/interfaces/image-type";
import { Position } from "~/commons/interfaces/position";
import { createSignal } from "solid-js";
import { createPixiTextureSignal } from "~/commons/functions/create-pixi-texture-signal";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { Bridge as BridgeConfig, Pickup } from "stranough-common";
import { PositionWithRotation } from "stranough-server/dist/interfaces/position.interface";

export function createBridge(
  b?: ServerEntities.Bridge,
  options?: {
    onSave?: (g: Bridge) => () => Promise<void>;
  }
): Bridge {
  const [texture, setTexture] = createSignal(
    b?.texture && {
      id: b.texture.id,
      // @ts-ignore
      filename: b.texture.filename,
    }
  );
  
  const stringSpawnPoint = createSignalObjectArray<
    | {
        position: SignalObject<Position | undefined>;
      }
    | undefined,
    Position | undefined
  >(
    b?.stringSpawnPoint && b.stringSpawnPoint.length > 0
      ? b.stringSpawnPoint
      : Array.from({ length: b?.stringCount ?? 6 }, () => undefined),
    (p) => ({
      position : createSignalObject(p ? { x: p.x, y: p.y } : undefined),
    })
  );

  const stringCount = createSignalObject(b ? b.stringCount : 6);
  const bottomPoint = createSignalObject<Position | undefined>(
    b?.bottomPoint ?? { x: 0, y: 0 }
  )
  
  const type = createSignalObject(b?.type ? `${b.type}` as `${BridgeConfig.BridgeType}` : undefined);

  const obj: Bridge = {
    id: createSignalObject<number | undefined>(b ? b.id : undefined),
    name: createSignalObject(),
    description: createSignalObject(),
    placeholder: {
      name: createSignalObject(b ? b.name : "Bridge Name"),
      description: createSignalObject(b?.description  ?? "Bridge Description"),
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
    bottomPoint: {
      get : bottomPoint.get,
      set: (pos): void => {
        if(!pos) return;
        if(typeof pos === 'function'){
          bottomPoint.set({
            x : 0,
            y : pos(bottomPoint.get())?.y ?? 0,
          });
        }else {
          bottomPoint.set({
            x : 0,
            y : pos.y,
          });
        }
      },
    },
    extendable: createSignalObject(b?.extendable ?? false),
    isTremolo: createSignalObject(b?.tremolo ?? false),
    headless: createSignalObject(b?.headless ?? false),
    multiscale: createSignalObject(b?.multiscale ?? false),
    supportedPickup: createSignalObject(b?.supportedPickup ? `${b?.supportedPickup}` as `${Pickup.PickupType}` : undefined), 
    type: {
      get : type.get,
      set : (t)=>{
        const lastStringCount = obj.stringCount.get();
        if(typeof t === 'function'){
          const newType = t(type.get());
          type.set(newType);
          if(newType === 'mono'){
            obj.stringCount.set(1);
          }else {
            obj.stringCount.set(lastStringCount === 1 ? 6 : lastStringCount);
          }
        }else{
          type.set(t);
          if(t === 'mono'){
            obj.stringCount.set(1);
          }else {
            obj.stringCount.set(lastStringCount === 1 ? 6 : lastStringCount);
          }
        }
    }},
    selectedItem: createSignalObject<any>(undefined),
    pickupSpawnPoint: createSignalObject<Position | undefined>(
      b?.pickupSpawnPoint ?? { x: 0, y: 0 }
    ),
    isBass: createSignalObject(b ? b.isBass : false),
    getSelectedItem: () => {
      switch (obj.selectedItem.get()) {
        case "pivot":
          return obj.pivotPosition;
        case "stringSpawnPoint": {
          const pos = obj.stringSpawnPoint.getSelectedSignal()?.get();
          if(!pos)
            return undefined;
          return pos.position;
        }
        case "pickupSpawnPoint":
          return obj.pickupSpawnPoint;
        case "bottomPoint":
          return obj.bottomPoint;
        default:
          return undefined;
      }
    },
    
    stringCount: {
      get: stringCount.get,
      set: (x: number | ((y: number) => void)) => {
        if (typeof x === "function") x(stringCount.get());
        else stringCount.set(x);

        stringSpawnPoint.setState((p) =>
          Array.from(
            { length: stringCount.get() },
            (_, i) => p[i] ?? createSignalObject()
          )
        );
      },
    },

    stringSpawnPoint,
  };

  if (options?.onSave) {
    obj.save = options.onSave(obj);
  }

  return obj;
}

function createStringSpawnPoint(
  stringCount: number,
  positions?: (Position | undefined)[]
): StringSPType {
  const [signal, setSignal] = createSignal<
    SignalObject<Position | undefined>[]
  >(
    Array.from({ length: stringCount }, () =>
      createSignalObject<Position | undefined>(positions?.shift())
    )
  );
  return {
    state: signal,
    get: (i: number) => signal()[i],
  };
}
