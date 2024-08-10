import { ServerEntities } from "stranough-server";
import { Peg } from "./types";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { ImageType } from "~/commons/interfaces/image-type";
import { Position } from "~/commons/interfaces/position";
import { createSignal } from "solid-js";
import { createPixiTextureSignal } from "~/commons/functions/create-pixi-texture-signal";
import { SignalObject, setterParameter } from "~/commons/interfaces/signal-object";

export function createPeg(
  b?: ServerEntities.Peg,
  options?: {
    onSave?: (g: Peg) => () => Promise<void>;
  }
): Peg {
  const [pegCapTexture, setPegCapTexture] = createSignal(
    b?.pegCapTexture && {
      id: b.pegCapTexture.id,
      // @ts-ignore
      filename: b.pegCapTexture.filename,
    }
  );

  const [pegBackTexture, setPegBackTexture] = createSignal(
    b?.pegBackTexture && {
      id: b.pegBackTexture.id,
      // @ts-ignore
      filename: b.pegBackTexture.filename,
    }
  );

  const [pegRodTexture, setPegRodTexture] = createSignal(
    b?.pegRodTexture && {
      id: b.pegRodTexture.id,
      // @ts-ignore
      filename: b.pegRodTexture.filename,
    }
  );

  const obj: Peg = {
    id: createSignalObject<number | undefined>(b ? b.id : undefined),
    name: createSignalObject(),
    description: createSignalObject(),
    placeholder: {
      name: createSignalObject(b ? b.name : "Peg Name"),
      description: createSignalObject(b?.description ?? "Peg Description"),
    },
    thumbnail: createSignalObject<ImageType | null | undefined>(
      b?.thumbnail && {
        id: b.thumbnail.id,
        // @ts-ignore
        filename: b.thumbnail.filename,
      }
    ),
    slottedGuardColor: createSignalObject(b?.slottedGuardColor),
    slottedStringCount: createSignalObject(b?.slottedStringCount),
    forSlottedHeadstock: createSignalObject(b ? b.forSlottedHeadstock : false),
    pivotPosition: createSignalObject<Position | undefined>(
      b?.pivotPosition ?? { x: 0, y: 0 }
    ),
    price: createSignalObject(b ? b.price : 0),
    scale: createSignalObject(b?.scale ?? 1),
    isBass: createSignalObject(b ? b.isBass : false),
    pegRodPivotPosition: createSignalObject<Position | undefined>(
      b?.pegRodPivotPosition ?? { x: 0, y: 0 }
    ),
    selectedItem: createSignalObject(),
    pegBackPivotPosition : createSignalObject<Position | undefined>(
      b?.pegBackPivotPosition ?? { x: 0, y: 0 }
    ),
    pegBackTexture : {
      get: pegBackTexture,
      set: setPegBackTexture
    },
    pegCapTexture : {
      get: pegCapTexture,
      set: setPegCapTexture
    },
    pegRodTexture : {
      get: pegRodTexture,
      set: setPegRodTexture
    },
    getSelectedItem: (): SignalObject<Position | undefined> | undefined => {
      switch (obj.selectedItem.get()) {
        case "pivot":
          return {
            get: obj.pivotPosition.get,
            set: obj.pivotPosition.set
          };
        case "pegBackPivot":
          return {
            get: obj.pegBackPivotPosition.get,
            set: obj.pegBackPivotPosition.set
          };
        case "pegRodPivot" : 
          return {
            get: obj.pegRodPivotPosition.get,
            set: obj.pegRodPivotPosition.set
          };
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
