import { ServerDtos} from "stranough-server";
import { Nut } from "./utils/types";
import { createNut } from "./utils/create-nut";
import { createCommonRepository } from "~/commons/functions/create-common-repository";
import { nullOrValue } from "~/commons/functions/null-or-value";

export const nutRepository = createCommonRepository<Nut, ServerDtos.NutDto, {
  stringCount ?: number,
  headlessOnly ?: boolean,
  isBass ?: boolean,
}>(
  "nuts",
  createNut,
  signalToDto
);

//TODO: add validation for stringSpawnPoint, count, texture
function signalToDto(b: Nut): ServerDtos.NutDto {
  return {
    description: b.description.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    stringCount: b.stringCount.get(),
    headlessOnly: b.headlessOnly.get(),
    isBass: b.isBass.get(),
    stringSpawnPoint: b.stringSpawnPoint.state().map((s) => s.get()!),
    texture: b.texture.get()!.id,
    thumbnail: nullOrValue(b.thumbnail.get(), b.thumbnail.get()?.id),
  };
}
