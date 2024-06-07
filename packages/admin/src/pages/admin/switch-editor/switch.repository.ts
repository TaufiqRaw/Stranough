import { ServerDtos} from "stranough-server";
import { Switch } from "./utils/types";
import { createSwitch } from "./utils/create-switch";
import { createCommonRepository } from "~/commons/functions/create-common-repository";
import { nullOrValue } from "~/commons/functions/null-or-value";

export const switchRepository = createCommonRepository(
  "switchs",
  createSwitch,
  signalToDto
);

//TODO: add validation for type, texture
function signalToDto(b: Switch): ServerDtos.SwitchDto {
  return {
    description: b.description.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    texture: b.texture.get()!.id,
    thumbnail: nullOrValue(b.thumbnail.get(), b.thumbnail.get()?.id),
  };
}
