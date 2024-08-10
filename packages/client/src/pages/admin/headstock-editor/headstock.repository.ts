import { ServerDtos, ServerEntities} from "stranough-server";
import { Headstock } from "./utils/types";
import { createCommonRepository } from "~/commons/functions/create-common-repository";
import { createHeadstock } from "./utils/create-headstock";
import { nullOrValue } from "~/commons/functions/null-or-value";
import * as R from "remeda";

export const headstockRepository = createCommonRepository<Headstock, ServerDtos.HeadstockDto, {
  stringCount ?: number,
  isSlotted ?: boolean,
}>(
  "headstocks",
  createHeadstock,
  signalToDto
);

//TODO: add validation for pegsSpawnPoint
function signalToDto(b: Headstock): ServerDtos.HeadstockDto {
  const slottedGuardSpawnPoint = R.pipe(
    b.slottedGuardSpawnPoint.state(),
    R.map((p) => ({
      x : p.get()?.position.get()?.x ?? 0,
      y : p.get()?.position.get()?.y ?? 0,
      rotation: p.get()?.rotation.get() ?? 0,
    }))
  );

  console.log(slottedGuardSpawnPoint);
  return {
    description: b.description.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    stringCount: b.stringCount.get(),
    isSlotted: b.isSlotted.get(),
    pegsSpawnPoint: R.pipe(
      b.pegsSpawnPoint.state(),
      R.map((p) => ({
        x : p.get()?.position.get()?.x ?? 0,
        y : p.get()?.position.get()?.y ?? 0,
        rotation: p.get()?.rotation.get() ?? 0,
        flipped: p.get()?.flipped.get() ?? false
      }))
    ),
    texture: b.texture.get()!.id,
    thumbnail: nullOrValue(b.thumbnail.get(), b.thumbnail.get()?.id),
    backShadowTexture: nullOrValue(b.backShadowTexture.get(), b.backShadowTexture.get()?.id),
    frontShadowTexture: nullOrValue(b.frontShadowTexture.get(), b.frontShadowTexture.get()?.id),
    slottedGuardLength: b.slottedGuardLength.get(),
    slottedRodOffset: b.slottedRodOffset.get(),
    slottedGuardSpawnPoint,
  };
}
