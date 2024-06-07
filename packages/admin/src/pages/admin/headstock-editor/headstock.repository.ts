import { ServerDtos} from "stranough-server";
import { Headstock } from "./utils/types";
import { createCommonRepository } from "~/commons/functions/create-common-repository";
import { createHeadstock } from "./utils/create-headstock";
import { nullOrValue } from "~/commons/functions/null-or-value";
import * as R from "remeda";

export const headstockRepository = createCommonRepository(
  "headstocks",
  createHeadstock,
  signalToDto
);

//TODO: add validation for pegsSpawnPoint
function signalToDto(b: Headstock): ServerDtos.HeadstockDto {
  return {
    description: b.description.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    stringCount: b.stringCount.get(),
    pegsSpawnPoint: R.pipe(
      b.pegsSpawnPoint.state(),
      R.map((p) => ({
        x : p.get()?.position.get()?.x ?? 0,
        y : p.get()?.position.get()?.y ?? 0,
        rotation: p.get()?.rotation.get() ?? 0
      }))
    ),
    texture: b.texture.get()!.id,
    thumbnail: nullOrValue(b.thumbnail.get(), b.thumbnail.get()?.id),
    backShadowTexture: nullOrValue(b.backShadowTexture.get(), b.backShadowTexture.get()?.id),
    frontShadowTexture: nullOrValue(b.frontShadowTexture.get(), b.frontShadowTexture.get()?.id)
  };
}
