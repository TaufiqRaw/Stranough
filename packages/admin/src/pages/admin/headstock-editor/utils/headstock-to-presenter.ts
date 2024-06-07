import { Headstock } from "./types";
import * as R from 'remeda';

export function headstockToPresenter(h ?: Headstock) {
  if(!h) return undefined;
  return {
    texture: h.texture.get()?.filename,
    frontShadowTexture: h.frontShadowTexture.get()?.filename,
    backShadowTexture: h.backShadowTexture.get()?.filename,
    pivot: h.pivotPosition.get(),
    scale: h.scale.get(),
    pegsSpawnPoint : R.pipe(
      h.pegsSpawnPoint.state(),
      R.map((p)=>p.get()),
      R.values,
      R.map((p)=>({...p!.position.get()!, rotation : p!.rotation.get()!}))
    )
  }
}