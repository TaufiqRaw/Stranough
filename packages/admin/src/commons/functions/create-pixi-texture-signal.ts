import { Accessor, Setter } from "solid-js";
import { ImageTypeSignal } from "../interfaces/image-type-signal";
import { ImageType } from "../interfaces/image-type";
import { serverImgUrl } from "./server-img-url.util";
import { Assets } from "pixi.js";

type Tex = ImageType | undefined;

export function createPixiTextureSignal(t : Accessor<Tex>, set : Setter<Tex>): ImageTypeSignal{
  return {
    get : t,
    set : (_t : ImageType | undefined)=>{
      if(t()){
        Assets.unload(serverImgUrl(t()?.filename) ?? "");
      }
      set(_t);
    }
  }
}