import { ServerEntities } from "stranough-server";
import { Bridge, StringSPType } from "./types";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { ImageType } from "~/commons/interfaces/image-type";
import { Position } from "~/commons/interfaces/position";
import { createSignal } from "solid-js";
import { createPixiTextureSignal } from "~/commons/functions/create-pixi-texture-signal";
import { SignalObject } from "~/commons/interfaces/signal-object";

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
  const [stringSPP, setStringSPP] = createSignal<StringSPType[]>(
    b
      ? b.stringSpawnPoint.map((point) =>
          createStringSpawnPoint(b.stringCount, point)
        )
      : []
  );
  const stringSPPIndex = createSignalObject<[number, number]>();
  const stringCount = createSignalObject(b ? b.stringCount : 6);

  const obj: Bridge = {
    id: createSignalObject<number | undefined>(b ? b.id : undefined),
    name: createSignalObject(),
    description: createSignalObject(),
    placeholder: {
      name: createSignalObject(b ? b.name : "Bridge Name"),
      description: createSignalObject(b ? b.description : "Bridge Description"),
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
    selectedItem: createSignalObject<any>(undefined),
    getSelectedItem: () => {
      switch (obj.selectedItem.get()) {
        case "pivot":
          return obj.pivotPosition;
        case "stringSpawnPoint": {
          if (stringSPPIndex.get() === undefined) return undefined;

          const [i, j] = stringSPPIndex.get()!;
          return obj.stringSpawnPoint.get(i)?.get(j);
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

        setStringSPP((pp) =>
          pp.map((p) =>
            createStringSpawnPoint(
              stringCount.get(),
              p.state().map((s) => s.get())
            )
          )
        );
      },
    },
    stringSpawnPoint: {
      state: stringSPP,
      get: (i) => stringSPP()[i],
      remove: (i) => {
        setStringSPP(stringSPP().filter((_, index) => index !== i));
        stringSPPIndex.set(undefined);
      },
      selectedIndex: stringSPPIndex,
      add: () =>
        setStringSPP([
          ...stringSPP(),
          createStringSpawnPoint(obj.stringCount.get()),
        ]),
    },
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
