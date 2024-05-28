import {
  createMemo,
  createSignal,
} from "solid-js";
import { ServerEntities } from "stranough-server";
import {
  GuitarBody,
  GuitarBodyTextureKeyType,
  GuitarBodyTexture,
  SpawnPointType,
} from "../types";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { createBodyTexture } from "./create-body-texture";
import { ImageType } from "~/commons/interfaces/image-type";

export function createGuitarBody(
  props?: ServerEntities.GuitarBody & {selectedBodyTexture?: GuitarBodyTextureKeyType}
): GuitarBody {
  const [selectedBodyTexture, setSelectedBodyTexture] = createSignal<
    GuitarBodyTextureKeyType | undefined
  >(props?.selectedBodyTexture);

  const signal: GuitarBody = {
    id: createSignalObject<number | undefined>(props?.id),
    mask : createSignalObject<ImageType | null | undefined>(props?.mask ? {
      //@ts-ignore
      id: props?.mask?.id,
      //@ts-ignore
      filename: props?.mask?.filename,
    } : undefined),
    maskScale : createSignalObject<number>(props?.maskScale ?? 1),
    selectedBodyTexture: {
      get: selectedBodyTexture,
      set: (x) => {
        if (!!x && !signal[x].get()) {
          signal[x].set(createBodyTexture());
        }
        setSelectedBodyTexture(x);
      },
    },
    getSelectedBodyTextureSignal: () => {
      if (!selectedBodyTexture()) return undefined;
      return signal[selectedBodyTexture()!].get();
    },
    flatTopBackTexture: createSignalObject<
      GuitarBodyTexture | null | undefined
    >(props?.flatTopBackTexture ? createBodyTexture(props?.flatTopBackTexture) : undefined),
    forearmCutTexture: createSignalObject<GuitarBodyTexture | null | undefined>(
      props?.forearmCutTexture ? createBodyTexture(props?.forearmCutTexture) : undefined
    ),
    tummyCutTexture: createSignalObject<GuitarBodyTexture | null | undefined>(
      props?.tummyCutTexture ? createBodyTexture(props?.tummyCutTexture) : undefined
    ),
    forearmTummyCutTexture: createSignalObject<
      GuitarBodyTexture | null | undefined
    >(props?.forearmTummyCutTexture ? createBodyTexture(props?.forearmTummyCutTexture) : undefined),
    carvedTopTexture: createSignalObject<GuitarBodyTexture | null | undefined>(
      props?.carvedTopTexture ? createBodyTexture(props?.carvedTopTexture) : undefined
    ),
    carvedTopBackTexture: createSignalObject<
      GuitarBodyTexture | null | undefined
    >(props?.carvedTopBackTexture ? createBodyTexture(props?.carvedTopBackTexture) : undefined),
    carvedTopTummyCutTexture: createSignalObject<
      GuitarBodyTexture | null | undefined
    >(props?.carvedTopTummyCutTexture ? createBodyTexture(props?.carvedTopTummyCutTexture) : undefined),
  };

  // createEffect(()=>{
  //   console.log(signal.getSelectedBodyTextureSignal()?.get());
  // })
  return signal;
}
