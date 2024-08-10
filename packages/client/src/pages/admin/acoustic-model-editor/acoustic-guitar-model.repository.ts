import { ServerDtos} from "stranough-server";
import { AcousticGuitarModel } from "./utils/types";
import { createAcousticGuitarModel } from "./utils/create-acoustic-guitar-model";
import { createCommonRepository } from "~/commons/functions/create-common-repository";
import { nullOrValue } from "~/commons/functions/null-or-value";

export const acousticGuitarModelRepository = createCommonRepository(
  "acoustic-guitars",
  createAcousticGuitarModel,
  signalToDto
);

//TODO: add validation for fingerboardSpawnPoint
function signalToDto(b: AcousticGuitarModel): ServerDtos.AcousticGuitarModelDto {
  return {
    description: b.description.get(),
    name: b.name.get(),
    price: b.price.get(),
    thumbnail: b.thumbnail.get()?.id,
    maskScale: b.maskScale.get(),
    softCutawayMask: nullOrValue(b.softCutawayMask.get(), b.softCutawayMask.get()?.id),
    venetianCutawayMask: nullOrValue(b.venetianCutawayMask.get(), b.venetianCutawayMask.get()?.id),
    florentineCutawayMask: nullOrValue(b.florentineCutawayMask.get(), b.florentineCutawayMask.get()?.id),
    bridgeSpawnPoint: b.spawnPoints.bridge.position.get()!,
    beveledMask: b.beveledMask.get()!.id,
    normalMask: b.normalMask.get()!.id,
    bottomSpawnPoint: b.spawnPoints.bottomEnd.position.get()!,
    preampSpawnPoint: {
      ...b.spawnPoints.preamp.position.get()!,
      rotation: b.spawnPoints.preamp.rotation.get(),
    },
    topSpawnPoint: b.spawnPoints.topEnd.position.get()!,
  };
}
