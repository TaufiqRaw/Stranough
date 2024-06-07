import { Accessor, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { ImageType } from "~/commons/interfaces/image-type";
import {
  GuitarBodyTexture,
  GuitarBodyTextureMediaKeyType,
} from "../types";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { Assets } from "pixi.js";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import * as R from "remeda";
import { guitarBodyTextureMediaKey } from "../constant";
import { SignalObject, setterParameter } from "~/commons/interfaces/signal-object";
export function createBodyTexture(
  props?: ServerEntities.GuitarBodyTexture
): GuitarBodyTexture | undefined {
  const texturePick = R.pick(
    props || ({} as ServerEntities.GuitarBodyTexture),
    guitarBodyTextureMediaKey
  );
  const textureConverted = guitarBodyTextureMediaKey.reduce((acc, key) => {
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
  }, {} as Record<keyof Pick<ServerEntities.GuitarBodyTexture, typeof ServerEntities.GuitarBodyTexture.mediaKeys[number]>, SignalObject<ImageType | null | undefined>>);
  return {
    id: createSignalObject<number | undefined>(props?.id),
    scale: createSignalObject<number>(props?.scale || 1),
    price: createSignalObject<number>(props?.price || 0),
    ...textureConverted,
  };
}
