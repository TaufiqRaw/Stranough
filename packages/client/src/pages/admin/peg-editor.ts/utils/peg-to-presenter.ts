import { PegPresenterProps } from "~/commons/presenter/types";
import { Peg } from "./types";

export function pegToPresenter(p?: Peg) : PegPresenterProps | undefined{
  if(!p) return undefined
  return {
    texture : {
      cap : p.pegCapTexture.get()?.filename,
      back : p.pegBackTexture.get()?.filename,
      rod : p.pegRodTexture.get()?.filename,
    },
    pivot : p.pivotPosition.get(),
    rodPivot : p.pegRodPivotPosition.get(),
    backPivot : p.pegBackPivotPosition.get(),
    scale : p.scale.get(),
    forSlottedHeadstock : p.forSlottedHeadstock.get(),
  }
}