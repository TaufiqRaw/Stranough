import { ServerDtos} from "stranough-server";
import { Knob } from "./utils/types";
import { createKnob } from "./utils/create-knob";
import { createCommonRepository } from "~/commons/functions/create-common-repository";

export const knobRepository = createCommonRepository(
  "knobs",
  createKnob,
  signalToDto
);

//TODO: add validation for stringSpawnPoint, count, texture
function signalToDto(b: Knob): ServerDtos.KnobDto {
  return {
    id: b.id.get(),
    description: b.description.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    texture: b.texture.get()!.id,
    thumbnail: b.thumbnail.get()?.id,
  };
}
