import { createMemo, createResource, useContext } from "solid-js";
import { useGuitarModelSignal } from "../guitar-model.context";
import { guitarBodyTextureKey, guitarBodyTextureMediaKey, guitarModelBodyKey } from "./constant";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { Assets, Texture } from "pixi.js";
import { GuitarBodyTextureMediaKeyType } from "./types";

export function createLoadSelectedBodyTexture() {
  const guitarModel = useGuitarModelSignal();
  const selectedTexture = createMemo(() => {
    return guitarModel
      .getSelectedBodySignal()
      ?.getSelectedBodyTextureSignal()
  });

  const selectedTextureToLoad = createMemo(() => {
    const selectedTextureUrl = [];
    if (
      guitarModel
        .getSelectedBodySignal()
        ?.getSelectedBodyTextureSignal()
    ) {
      for (const modelBodyKey of guitarModelBodyKey) {
        const body = guitarModel[modelBodyKey].get();
        for (const bodyTextureKey of guitarBodyTextureKey) {
          const bodyTexture = body?.[bodyTextureKey].get();
          for (const key of guitarBodyTextureMediaKey) {
            const texture = bodyTexture?.[key].get();
            if (texture) {
              selectedTextureUrl.push(serverImgUrl(texture.filename));
            }
          }
        }
      }
    }
    return selectedTextureUrl;
  });

  const [textureResources] = createResource(
    selectedTextureToLoad,
    async (urls) => {
      await Assets.load(urls);
    }
  );

  return createMemo(() => {
    if (textureResources.state != "ready") return undefined;
    if (!selectedTexture()?.mask.get()) {
      return undefined;
    }

    const textures = {} as Record<GuitarBodyTextureMediaKeyType, Texture | undefined>;

    for (const key of guitarBodyTextureMediaKey) {
      if(selectedTexture()?.[key].get()) 
        (textures[key] = Texture.from(serverImgUrl(selectedTexture()![key].get()!.filename)));
    }

    return textures;
  });
}