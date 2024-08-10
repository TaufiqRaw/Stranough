import { AcousticModelPresenterProps } from "~/commons/presenter/types";
import { AcousticGuitarModel } from "./types";
import { Accessor } from "solid-js";
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

export function acousticModelToPresenter(model : ()=>AcousticGuitarModel | undefined) : AcousticModelPresenterProps{

  const body : AcousticModelPresenterProps['body'] = {
    mask: model()?.mask(),
    scale: model()?.maskScale.get(),
  };

  const spawnpoints : AcousticModelPresenterProps['spawnpoints'] = {
    // fingerboard: model()?.spawnPoints.fingerboard.position.get(),
    bridge: model()?.spawnPoints.bridge.position.get(),
    // jack : getPosAndRot(model()?.spawnPoints.jack),
  };

  return {
    body,
    spawnpoints
  }
}