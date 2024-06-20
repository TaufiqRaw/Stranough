import {
  createMemo,
  createSignal,
} from "solid-js";
import { ServerEntities } from "stranough-server";
import {
  GuitarBody,
  GuitarBodyTextureKeyType,
  GuitarBodyContour,
  SpawnPointType,
  AvailableTopContour,
  AvailableBackContour,
} from "../types";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { createBodyTexture } from "./create-body-texture";
import { ImageType } from "~/commons/interfaces/image-type";
import { setterParameter } from "~/commons/interfaces/signal-object";

export function createGuitarBody(
  props?: ServerEntities.GuitarBody & {
    selectedTopContour?: AvailableTopContour;
    selectedBackContour?: AvailableBackContour;
  }
): GuitarBody {
  const [selectedTopContour, setSelectedTopContour] = createSignal<AvailableTopContour | undefined>(
    props?.selectedTopContour ?? props?.topCarvedContour ? "topCarvedContour" : props?.topFlatContour ? "topFlatContour" : props?.topForearmContour ? "topForearmContour" : undefined
  );

  const [selectedBackContour, setSelectedBackContour] = createSignal<AvailableBackContour | undefined>(
    props?.selectedBackContour ?? props?.backCarvedContour ? "backCarvedContour" : props?.backFlatContour ? "backFlatContour" : props?.backTummyContour ? "backTummyContour" : undefined
  );

  const [selectedContour, setSelectedContour] = createSignal<AvailableTopContour | AvailableBackContour | undefined>(
    selectedTopContour() ?? selectedBackContour() ?? undefined
  );

  const signal: GuitarBody = {
    id: createSignalObject<number | undefined>(props?.id),
    price: createSignalObject<number>(props?.price ?? 0),
    backMask : createSignalObject<ImageType | null | undefined>(props?.backMask ? {
      //@ts-ignore
      id: props?.backMask?.id,
      //@ts-ignore
      filename: props?.backMask?.filename,
    } : undefined),
    mask : createSignalObject<ImageType | null | undefined>(props?.mask ? {
      //@ts-ignore
      id: props?.mask?.id,
      //@ts-ignore
      filename: props?.mask?.filename,
    } : undefined),
    burstTop : createSignalObject<ImageType | null | undefined>(props?.burstTop ? {
      //@ts-ignore
      id: props?.burstTop?.id,
      //@ts-ignore
      filename: props?.burstTop?.filename,
    } : undefined),
    burstBack : createSignalObject<ImageType | null | undefined>(props?.burstBack ? {
      //@ts-ignore
      id: props?.burstBack?.id,
      //@ts-ignore
      filename: props?.burstBack?.filename,
    } : undefined),
    selectedTopContour: {
      get: selectedTopContour,
      set: (x ?: setterParameter<AvailableTopContour>) : undefined => {
        setSelectedTopContour(x);
        const selected = selectedTopContour();
        if (!!selected && !signal[selected].get()) {
          signal[selected].set(createBodyTexture());
        }
        setSelectedContour(selectedTopContour());
      },
    },
    selectedBackContour: {
      get: selectedBackContour,
      set: (x ?: setterParameter<AvailableBackContour>) : undefined => {
        setSelectedBackContour(x);
        const selected = selectedBackContour();
        if (!!selected && !signal[selected].get()) {
          signal[selected].set(createBodyTexture());
        }
        setSelectedContour(selectedBackContour());
      },
    },
    selectedContour,
    getSelectedTopContourSignal: () => {
      if (!selectedTopContour()) return undefined;
      return signal[selectedTopContour()!].get();
    },
    getSelectedBackContourSignal: () => {
      if (!selectedBackContour()) return undefined;
      return signal[selectedBackContour()!].get();
    },
    getSelectedContourSignal: ()=>{
      if (!selectedContour()) return undefined;
      return signal[selectedContour()!].get();
    },
    topFlatContour : createSignalObject<
      GuitarBodyContour | null | undefined
    >(props?.topFlatContour ? createBodyTexture(props.topFlatContour) : undefined),
    topCarvedContour : createSignalObject<
      GuitarBodyContour | null | undefined
    >(props?.topCarvedContour ? createBodyTexture(props.topCarvedContour) : undefined),
    topForearmContour : createSignalObject<
      GuitarBodyContour | null | undefined
    >(props?.topForearmContour ? createBodyTexture(props.topForearmContour) : undefined),
    backFlatContour : createSignalObject<
      GuitarBodyContour | null | undefined
    >(props?.backFlatContour ? createBodyTexture(props.backFlatContour) : undefined),
    backCarvedContour : createSignalObject<
      GuitarBodyContour | null | undefined
    >(props?.backCarvedContour ? createBodyTexture(props.backCarvedContour) : undefined),
    backTummyContour : createSignalObject<
      GuitarBodyContour | null | undefined
    >(props?.backTummyContour ? createBodyTexture(props.backTummyContour) : undefined),
  };

  return signal;
}
