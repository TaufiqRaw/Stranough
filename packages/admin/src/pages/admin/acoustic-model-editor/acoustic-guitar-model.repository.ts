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
    noneCutawayMask: nullOrValue(b.noneCutawayMask.get(), b.noneCutawayMask.get()?.id),
    softCutawayMask: nullOrValue(b.softCutawayMask.get(), b.softCutawayMask.get()?.id),
    venetianCutawayMask: nullOrValue(b.venetianCutawayMask.get(), b.venetianCutawayMask.get()?.id),
    florentineCutawayMask: nullOrValue(b.florentineCutawayMask.get(), b.florentineCutawayMask.get()?.id),
    noneCutawayBurst: nullOrValue(b.noneCutawayBurst.get(), b.noneCutawayBurst.get()?.id),
    softCutawayBurst: nullOrValue(b.softCutawayBurst.get(), b.softCutawayBurst.get()?.id),
    venetianCutawayBurst: nullOrValue(b.venetianCutawayBurst.get(), b.venetianCutawayBurst.get()?.id),
    florentineCutawayBurst: nullOrValue(b.florentineCutawayBurst.get(), b.florentineCutawayBurst.get()?.id),
    fingerboardSpawnPoint: b.spawnPoints.fingerboard.position.get()!,
    fingerboardBackEndSpawnPoint: b.spawnPoints.fingerboardBackEnd.position.get(),
    bridgeSpawnPoint: b.spawnPoints.bridge.position.get()!,
    jackSpawnPoint : b.spawnPoints.jack.position.get() ? {
      rotation : b.spawnPoints.jack.rotation.get(),
      ...b.spawnPoints.jack.position.get()!,
    } : undefined,
  };
}
