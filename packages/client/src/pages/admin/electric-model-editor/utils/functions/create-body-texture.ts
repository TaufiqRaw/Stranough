import { Accessor, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { ImageType } from "~/commons/interfaces/image-type";
import {
  GuitarBodyContour,
  GuitarBodyTextureMediaKeyType,
} from "../types";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { Assets } from "pixi.js";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import * as R from "remeda";
import { guitarBodyContourMediaKey } from "../constant";
import { SignalObject, setterParameter } from "~/commons/interfaces/signal-object";
export function createBodyTexture(
  props?: ServerEntities.GuitarBodyContour
): GuitarBodyContour | undefined {
  const texturePick = R.pick(
    props || ({} as ServerEntities.GuitarBodyContour),
    guitarBodyContourMediaKey
  );
  const textureConverted = guitarBodyContourMediaKey.reduce((acc, key) => {
    if (texturePick[key]) {
      const [image, setImage] = createSignal<ImageType | null | undefined>({
        //@ts-ignore
        id: texturePick[key].id,
        //@ts-ignore
        filename: texturePick[key].filename,
      });

      acc[key] = {
        get: image,
        set: (x ?: setterParameter<ImageType | null>) : undefined => {
          if (image()) {
            Assets.unload(serverImgUrl(image()!.filename) ?? "");
          }
          setImage(x);
        },
      };
    } else {
      acc[key] = createSignalObject<ImageType | null | undefined>();
    }
    return acc;
  }, {} as Record<keyof Pick<ServerEntities.GuitarBodyContour, typeof ServerEntities.GuitarBodyContour.mediaKeys[number]>, SignalObject<ImageType | null | undefined>>);
  return {
    id: createSignalObject<number | undefined>(props?.id),
    price: createSignalObject<number>(props?.price || 0),
    ...textureConverted,
  };
}
