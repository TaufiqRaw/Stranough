import { Accessor, createMemo } from "solid-js";
import { GuitarModel } from "../types";
import { Position } from "~/commons/interfaces/position";

function getPosAndRot(point?: {
  position: { get: Accessor<Position | undefined> };
  rotation: { get: Accessor<number> };
}) {
  if(!point) return undefined;
  return {
    x: point.position.get()?.x,
    y: point.position.get()?.y,
    rotation: point.rotation.get() || 0,
  };
}

export function guitarModelToPresenter(model : Accessor<GuitarModel | undefined>){

  const selectedTexture = createMemo(() => {
    const defaultMask = model()?.getSelectedBodySignal()?.mask.get()?.filename;
    const texture = model()
      ?.getSelectedBodySignal()
      ?.getSelectedBodyTextureSignal();
    if (!texture && !defaultMask) return undefined;

    return {
      defaultMask,
      mask: texture?.mask.get()?.filename,
      defaultMaskScale : model()?.getSelectedBodySignal()?.maskScale.get(),
      backMask: texture?.backMask.get()?.filename,
      frontShadowTexture: texture?.frontShadowTexture.get()?.filename,
      backShadowTexture: texture?.backShadowTexture.get()?.filename,
      frontSpecularTexture: texture?.frontSpecularTexture.get()?.filename,
      backSpecularTexture: texture?.backSpecularTexture.get()?.filename,
      frontHoleMask: texture?.frontHoleMask.get()?.filename,
      scale: texture?.scale.get(),
    };
  });

  const spawnpoints = createMemo(() => {
    const spawnpoints = model()?.spawnPoints;
    if (!spawnpoints) return undefined;

    return {
      fingerboard: spawnpoints.fingerboard.position.get(),
      bridge: spawnpoints.bridge.position.get(),
      switch: getPosAndRot(spawnpoints.switch),
      jack: {
        side: getPosAndRot(spawnpoints.jack.side),
        top: getPosAndRot(spawnpoints.jack.top),
      },
      pickup: {
        neck: spawnpoints.pickup.neck.position.get(),
        middle: spawnpoints.pickup.middle.position.get(),
        bridge: spawnpoints.pickup.bridge.position.get(),
      },
      knobs: spawnpoints.knobs.get().map((p) => p.get()),
    };
  });

  return {
    selectedTexture,
    spawnpoints
  }
}