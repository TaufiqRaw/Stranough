import { ServerDtos} from "stranough-server";
import { Pickup } from "./utils/types";
import { createPickup } from "./utils/create-pickup";
import { createCommonRepository } from "~/commons/functions/create-common-repository";
import { nullOrValue } from "~/commons/functions/null-or-value";

export const pickupRepository = createCommonRepository(
  "pickups",
  createPickup,
  signalToDto
);

//TODO: add validation for type, texture
function signalToDto(b: Pickup): ServerDtos.PickupDto {
  return {
    description: b.description.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    texture: b.texture.get()!.id,
    thumbnail: nullOrValue(b.thumbnail.get(), b.thumbnail.get()?.id),
    type : b.type.get()!,
    stringCount: b.stringCount.get(),
  };
}
