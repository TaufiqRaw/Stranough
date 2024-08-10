import { ServerDtos } from "stranough-server";
import { Bridge } from "./utils/types";
import {Bridge as BridgeConfig} from 'stranough-common'
import { createBridge } from "./utils/create-bridge";
import { createCommonRepository } from "~/commons/functions/create-common-repository";
import { nullOrValue } from "~/commons/functions/null-or-value";
import * as R from "remeda";

export const bridgeRepository = createCommonRepository<Bridge, ServerDtos.BridgeDto, {
  isBass ?: boolean,
  stringCount ?: number,
  headlessOnly ?: boolean,
  multiscale ?: boolean,
  type ?: 'tailpiece' | 'tuneomatic',
}>(
  "bridges",
  createBridge,
  signalToDto
);

//TODO: add validation for stringSpawnPoint, count, texture
function signalToDto(b: Bridge): ServerDtos.BridgeDto {
  const obj : ServerDtos.BridgeDto  = {
    description: b.description.get(),
    headless : b.headless.get(),
    multiscale : b.multiscale.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    stringCount: b.stringCount.get(),
    bottomPoint: b.bottomPoint.get(),
    isBass: b.isBass.get(),
    extendable: b.extendable.get(),
    pickupSpawnPoint : b.pickupSpawnPoint.get() ? {
      x: b.pickupSpawnPoint.get()!.x,
      y: b.pickupSpawnPoint.get()!.y,
      rotation : b.pickupSpawnPoint.get()?.rotation ?? 0,
    } : null,
    supportedPickup : b.supportedPickup.get() ?? null,
    tremolo : b.isTremolo.get(),
    type : b.type.get(),
    stringSpawnPoint: R.pipe(
      b.stringSpawnPoint.state(),
      R.map((p) => ({
        x : p.get()?.position.get()?.x ?? 0,
        y : p.get()?.position.get()?.y ?? 0,
      }))
    ),
    texture: b.texture.get()!.id,
    thumbnail: nullOrValue(b.thumbnail.get(), b.thumbnail.get()?.id),
  };

  return obj;
}
