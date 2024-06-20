import { Peg } from "./types";

export function pegToPresenter(p?: Peg){
  if(!p) return undefined
  return {
    texture : {
      cap : p.pegCapTexture.get()?.filename,
      back : p.pegBackTexture.get()?.filename,
    },
    pivot : p.pivotPosition.get(),
    backPivot : p.pegBackPivotPosition.get(),
    scale : p.scale.get(),
  }
}