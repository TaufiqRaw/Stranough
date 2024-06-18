import { Accessor } from "solid-js"
import { ImageType } from "../interfaces/image-type"
import { ImageTypeSignal, NullableImageTypeSignal } from "../interfaces/image-type-signal"
import { SignalObject } from "../interfaces/signal-object"

export function toCommonPresenter(props : {
  texture : SignalObject<ImageType | null |undefined> | NullableImageTypeSignal | ImageTypeSignal,
  pivotPosition : SignalObject<{x:number, y:number} | undefined>,
  scale : {
    get : Accessor<number | undefined>,
  },
}) {
  return {
    texture : props.texture.get()?.filename,
    pivot : props.pivotPosition.get(),
    scale : props.scale.get(),
  }
}