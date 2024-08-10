import { Accessor, Resource, createMemo } from "solid-js";
import { ElectricModel } from "../types";
import { Position } from "~/commons/interfaces/position";
import { ElecticModelPresenterProps } from "~/commons/presenter/types";

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

export function electricModelToPresenter(model : ()=>ElectricModel | undefined) : ElecticModelPresenterProps{

  const topContour = model()?.getSelectedTopContourSignal;
  const backContour = model()?.getSelectedBackContourSignal;
  const body : ElecticModelPresenterProps['body'] = {
    mask: model()?.mask.get()?.filename,
    type: model()?.selectedConstruction.get() ?? undefined,
    electronicOverlayTexture : model()?.electronicCoverOverlay.get()?.filename,
    topContourTexture: topContour?.()?.get()?.filename,
    backContourTexture: backContour?.()?.get()?.filename,
    scale: model()?.maskScale.get(),
    leftMostPoint: model()?.leftMostPoint(),
  };

  const spawnpoints : ElecticModelPresenterProps['spawnpoints'] = {
    borderPoints : model()?.maskBordersPoints?.(),
    topEnd: model()?.spawnPoints.top.position.get(),
    bottomEnd: model()?.spawnPoints.bottom.position.get(),
    bridge: model()?.spawnPoints.bridge.position.get(),
    switch: getPosAndRot(model()?.spawnPoints.switch),
    jack: {
      side: getPosAndRot(model()?.spawnPoints.jack.side),
      top: getPosAndRot(model()?.spawnPoints.jack.top),
    },
    electronicCover: getPosAndRot(model()?.spawnPoints.electronicCover),
    batteryCover: getPosAndRot(model()?.spawnPoints.batteryCover),
    knobs: model()?.spawnPoints.knobs.get().map((p) => p.get()),
    leftHole: model()?.spawnPoints.soundHoleLeft.position ? {...model()!.spawnPoints.soundHoleLeft.position.get()!, rotation: model()?.spawnPoints.soundHoleLeft.rotation.get() ?? 0} : undefined,
    rightHole: model()?.spawnPoints.soundHoleRight.position ? {...model()!.spawnPoints.soundHoleRight.position.get()!, rotation: model()?.spawnPoints.soundHoleRight.rotation.get() ?? 0} : undefined,
  };

  return {
    body,
    spawnpoints,
    holeScale: model()?.soundHoleScale.get(),
    mirrorHole: model()?.mirrorSoundHole.get(),
    bridgeToBottom: model()?.bridgeToBottom.get,
  }
}