import { ServerDtos} from "stranough-server";
import { Jack } from "./utils/types";
import { createJack } from "./utils/create-jack";
import { createCommonRepository } from "~/commons/functions/create-common-repository";
import { nullOrValue } from "~/commons/functions/null-or-value";

export const jackRepository = createCommonRepository<Jack, ServerDtos.JackDto, {
  isSide ?: boolean,
}>(
  "jacks",
  createJack,
  signalToDto
);

//TODO: add validation for stringSpawnPoint, count, texture
function signalToDto(b: Jack): ServerDtos.JackDto {
  return {
    description: b.description.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    texture: b.texture.get()!.id,
    thumbnail: nullOrValue(b.thumbnail.get(), b.thumbnail.get()?.id),
    isSide : b.isSide.get(),
  };
}
