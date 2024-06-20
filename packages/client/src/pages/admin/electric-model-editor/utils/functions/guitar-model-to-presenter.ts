import { Accessor, Resource, createMemo } from "solid-js";
import { ElectricModel } from "../types";
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

export function guitarModelToPresenter(model : ()=>ElectricModel | undefined){

  const topContour = model()?.getSelectedBodySignal()?.getSelectedTopContourSignal;
  const backContour = model()?.getSelectedBodySignal()?.getSelectedBackContourSignal;
  const body = {
    mask: model()?.getSelectedBodySignal()?.mask.get()?.filename,
    backMask: model()?.getSelectedBodySignal()?.backMask.get()?.filename,
    type: model()?.selectedBody.get() ?? undefined,
    frontShadowTexture: topContour?.()?.shadowTexture.get()?.filename,
    frontSpecularTexture: topContour?.()?.specularTexture.get()?.filename,
    backShadowTexture: backContour?.()?.shadowTexture.get()?.filename,
    backSpecularTexture: backContour?.()?.specularTexture.get()?.filename,
    scale: model()?.maskScale.get(),
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