import { Accessor } from "solid-js";
import { ImageType } from "./image-type";

export interface ImageTypeSignal {
  get : Accessor<ImageType | undefined>,
  set : (t : ImageType | undefined)=>void,
}

export interface NullableImageTypeSignal{
  get : Accessor<ImageType | undefined | null>,
  set : (t : ImageType | undefined | null)=>void,
}