import { ServerDtos} from "stranough-server";
import { Pickguard } from "./utils/types";
import { createPickguard } from "./utils/create-pickguard";
import { createCommonRepository } from "~/commons/functions/create-common-repository";
import { nullOrValue } from "~/commons/functions/null-or-value";

export const pickguardRepository = createCommonRepository<Pickguard, ServerDtos.PickguardDto, {
  model ?: number,
}>(
  "pickguards",
  createPickguard,
  signalToDto
);

//TODO: add validation for model, texture, type
function signalToDto(item: Pickguard): ServerDtos.PickguardDto {
  return {
    description: item.description.get(),
    name: item.name.get(),
    price: item.price.get(),
    texture: item.texture.get()!.id,
    model : item.model.get(),
    scale: item.scale.get(),
    pivotPosition : item.pivotPosition.get(),
    type: item.type.get()!
  };
}
