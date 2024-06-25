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

export function electricModelToPresenter(model : ()=>ElectricModel | undefined){

  const topContour = model()?.getSelectedTopContourSignal;
  const backContour = model()?.getSelectedBackContourSignal;
  const body = {
    mask: model()?.getSelectedConstructionSignal()?.mask.get()?.filename,
    type: model()?.selectedConstruction.get() ?? undefined,
    shadowTexture: topContour?.()?.shadow.get()?.filename,
    specularTexture: topContour?.()?.spec.get()?.filename,
    backShadowTexture: backContour?.()?.shadow.get()?.filename,
    backSpecularTexture: backContour?.()?.spec.get()?.filename,
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
    pickguard : model()?.spawnPoints.pickguard.position.get(),
    knobs: model()?.spawnPoints.knobs.get().map((p) => p.get()),
  };

  return {
    body,
    spawnpoints
  }
}