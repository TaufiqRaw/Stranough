import { Accessor, batch, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { ImageType } from "~/commons/interfaces/image.type.util";
import { GuitarBody, GuitarBodyTextureKeyType, GuitarBodyTexture, GuitarBodyTextureMediaKeyType } from "../types";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { Assets } from "pixi.js";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import * as R from "remeda";
import { guitarBodyTextureMediaKey } from "../constant";
export function createBodyTexture(props ?: ServerEntities.GuitarBodyTexture) : GuitarBodyTexture | undefined {
  
  const texturePick = R.pick(props || {} as ServerEntities.GuitarBodyTexture, guitarBodyTextureMediaKey);
  const textureConverted = guitarBodyTextureMediaKey.reduce((acc, key) => {
    if(texturePick[key]){
      const [image, setImage] = createSignal<ImageType | null | undefined>({
        //@ts-ignore
        id : texturePick[key].id,
        //@ts-ignore
        filename : texturePick[key].filename,
      });

      // @ts-ignore
      acc[key] = {
        get : image,
        set : (x : ImageType | null | undefined)=>{
          if(image()){
            Assets.unload(serverImgUrl(image()!.filename));
          }
          setImage(x);
        }
      }
    }else{
      acc[key] = createSignalObject<ImageType | null | undefined>();
    }
    return acc;
  }, {} as Record<keyof Pick<ServerEntities.GuitarBodyTexture, GuitarBodyTextureMediaKeyType>, {get : Accessor<ImageType | null | undefined>, set : (x: ImageType | null | undefined)=>void }>);
  return {
    id : createSignalObject<number | undefined>(props?.id),
    scale : createSignalObject<number>(props?.scale || 1),
    ...textureConverted
  }
}