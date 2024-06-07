import { Accessor, Resource, createMemo } from "solid-js";
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

export function guitarModelToPresenter(model : ()=>GuitarModel | undefined){

  const texture = model()?.getSelectedBodySignal()?.getSelectedBodyTextureSignal;
  const body = {
    defaultMask : model()?.getSelectedBodySignal()?.mask.get()?.filename,
    mask: texture?.()?.mask.get()?.filename,
    defaultMaskScale : model()?.getSelectedBodySignal()?.maskScale.get(),
    backMask: texture?.()?.backMask.get()?.filename,
    frontShadowTexture: texture?.()?.frontShadowTexture.get()?.filename,
    backShadowTexture: texture?.()?.backShadowTexture.get()?.filename,
    frontSpecularTexture: texture?.()?.frontSpecularTexture.get()?.filename,
    backSpecularTexture: texture?.()?.backSpecularTexture.get()?.filename,
    frontHoleMask: texture?.()?.frontHoleMask.get()?.filename,
    scale: texture?.()?.scale.get(),
  };

  const spawnpoints = {
    fingerboard: model()?.spawnPoints.fingerboard.position.get(),
    bridge: model()?.spawnPoints.bridge.position.get(),
    switch: getPosAndRot(model()?.spawnPoints.switch),
    jack: {
      side: getPosAndRot(model()?.spawnPoints.jack.side),
      top: getPosAndRot(model()?.spawnPoints.jack.top),
    },
    pickup: {
      neck: model()?.spawnPoints.pickup.neck.position.get(),
      middle: model()?.spawnPoints.pickup.middle.position.get(),
      bridge: model()?.spawnPoints.pickup.bridge.position.get(),
    },
    knobs: model()?.spawnPoints.knobs.get().map((p) => p.get()),
  };

  return {
    body,
    spawnpoints
  }
}