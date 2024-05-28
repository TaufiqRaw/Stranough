import { ServerDtos} from "stranough-server";
import { Bridge } from "./utils/types";
import { createBridge } from "./utils/create-bridge";
import { createCommonRepository } from "~/commons/functions/create-common-repository";

export const bridgeRepository = createCommonRepository(
  "bridges",
  createBridge,
  signalToDto
);

//TODO: add validation for stringSpawnPoint, count, texture
function signalToDto(b: Bridge): ServerDtos.BridgeDto {
  return {
    id: b.id.get(),
    description: b.description.get(),
    name: b.name.get(),
    pivotPosition: b.pivotPosition.get(),
    price: b.price.get(),
    scale: b.scale.get(),
    stringCount: b.stringCount.get(),
    stringSpawnPoint: b.stringSpawnPoint
      .state()
      .map((spp) => spp.state().map((s) => s.get()!)),
    texture: b.texture.get()!.id,
    thumbnail: b.thumbnail.get()?.id,
  };
}
