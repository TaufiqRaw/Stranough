import { ServerDtos} from "stranough-server";
import { Jack } from "./utils/types";
import { createJack } from "./utils/create-jack";
import { createCommonRepository } from "~/commons/functions/create-common-repository";

export const jackRepository = createCommonRepository(
  "jacks",
  createJack,
  signalToDto
);

//TODO: add validation for stringSpawnPoint, count, texture
function signalToDto(b: Jack): ServerDtos.JackDto {
  return {
    id: b.id.get(),
    description: b.description.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    texture: b.texture.get()!.id,
    thumbnail: b.thumbnail.get()?.id,
    isSide : b.isSide.get(),
  };
}
