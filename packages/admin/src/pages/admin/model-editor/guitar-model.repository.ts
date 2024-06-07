import { ServerDtos, ServerEntities } from "stranough-server";
import { axios } from "~/commons/axios-instance";
import {
  GuitarBody,
  GuitarBodyTexture,
  GuitarBodyTextureKeyType,
  GuitarModel,
  GuitarModelBodyKeyType,
} from "./utils/types";
import { createModel } from "./utils/functions/create-model";
import { Owner, runWithOwner } from "solid-js";
import { nullOrValue } from "~/commons/functions/null-or-value";

export const guitarModelRepository = {
  async index(
    page: number,
    options?: {
      deep?: boolean;
    }
  ) {
    const { data } = await axios.get<[ServerEntities.GuitarModel[], number]>(
      `/guitar-models${options?.deep ? "/deep" : ""}?page=${page}`
    );
    return data[0];
  },

  async get(
    id: number,
    options: { 
      onSave?: (m: GuitarModel) => () => Promise<void>, 
      owner: Owner,
      selectedBody ?: GuitarModelBodyKeyType,
      selectedBodyTexture ?: GuitarBodyTextureKeyType
    }
  ) {
    const { data } = await axios.get<ServerEntities.GuitarModel & {
      selectedBody: GuitarModelBodyKeyType | undefined,
      selectedBodyTexture: GuitarBodyTextureKeyType | undefined
    }>(
      `/guitar-models/${id}`
    );
    data.selectedBody = options.selectedBody;
    data.selectedBodyTexture = options.selectedBodyTexture;
    return runWithOwner(options?.owner, () => {
      return createModel(
        data,
        options ? { onSave: options.onSave } : undefined
      );
    });
  },

  async create(m: GuitarModel) {
    const dto = signalToDto(m);
    const { data } = await axios.post<ServerEntities.GuitarModel>(
      "/guitar-models",
      dto
    );
    return data;
  },

  async update(m: GuitarModel) {
    const dto = signalToDto(m);
    const { data } = await axios.put<void>(`/guitar-models/${m.id.get()}`, dto);
  },

  async delete(id: number) {
    const { data } = await axios.delete<void>(`/guitar-models/${id}`);
  },

  queryKey: (props?: { id?: number; page?: number }) : [string, {[x: string]: any}] => {
    const option: { [x: string]: any } = {};
    props?.id && (option.id = props?.id);
    props?.page && (option.page = props?.page);

    return ["guitar-models", option];
  },
};

//TODO: add validation for stringSpawnPoint, count, texture
function signalToDto(m: GuitarModel): ServerDtos.GuitarModelDto {
  const knobs = m.spawnPoints.knobs
    .get()
    .filter((x) => x.get())
    .map((x) => x.get()!);
  const switchSp = m.spawnPoints.switch.position.get();
  const topJack = m.spawnPoints.jack.top.position.get();
  const sideJack = m.spawnPoints.jack.side.position.get();

  const spawnpoints = {
    bridgeSpawnPoint: m.spawnPoints.bridge.position.get()!,
    fingerboardSpawnPoint: m.spawnPoints.fingerboard.position.get()!,
    pickupSpawnPoint: {
      neck: m.spawnPoints.pickup.neck.position.get(),
      bridge: m.spawnPoints.pickup.bridge.position.get(),
      middle: m.spawnPoints.pickup.middle.position.get(),
    },
    knobSpawnPoint: knobs.length > 0 ? knobs : undefined,
    switchSpawnPoint: switchSp
      ? { ...switchSp, rotation: m.spawnPoints.switch.rotation.get() }
      : undefined,
    topJackSpawnPoint: topJack
      ? { ...topJack, rotation: m.spawnPoints.jack.top.rotation.get() }
      : undefined,
    sideJackSpawnPoint: sideJack
      ? { ...sideJack, rotation: m.spawnPoints.jack.side.rotation.get() }
      : undefined,
  };
  return {
    name: m.name.get(),
    description: m.description.get(),
    price: m.price.get(),
    isElectric: m.isElectric.get(),
    allowSingleCoilPickup: m.allowSingleCoilPickup.get(),
    boltOnBody: guitarBodyToServerDto(m.boltOnBody.get()),
    neckThroughBody: guitarBodyToServerDto(m.neckThroughBody.get()),
    setInBody: guitarBodyToServerDto(m.setInBody.get()),
    thumbnail: m.thumbnail.get()?.id,
    ...spawnpoints,
  };
}

function guitarBodyToServerDto(
  body: GuitarBody | null | undefined
): ServerDtos.GuitarBodyDto | undefined | null {
  if (!body) return body;
  //TODO: add validator for bridge, fingerboard
  return {
    price: body.price.get() ?? 0,
    mask: nullOrValue(body.mask.get(), body.mask.get()?.id),
    maskScale: body.maskScale.get(),
    burstTop: nullOrValue(body.burstTop.get(), body.burstTop.get()?.id),
    burstBack: nullOrValue(body.burstBack.get(), body.burstBack.get()?.id),
    carvedTopBackTexture: bodyTextureToServerDto(
      body.carvedTopBackTexture.get()
    ),
    carvedTopTexture: bodyTextureToServerDto(body.carvedTopTexture.get()),
    carvedTopTummyCutTexture: bodyTextureToServerDto(
      body.carvedTopTummyCutTexture.get()
    ),
    flatTopBackTexture: bodyTextureToServerDto(body.flatTopBackTexture.get()),
    forearmCutTexture: bodyTextureToServerDto(body.forearmCutTexture.get()),
    forearmTummyCutTexture: bodyTextureToServerDto(
      body.forearmTummyCutTexture.get()
    ),
    tummyCutTexture: bodyTextureToServerDto(body.tummyCutTexture.get()),
  };
}

//TODO: add validation for mask
function bodyTextureToServerDto(
  texture: GuitarBodyTexture | null | undefined
): ServerDtos.GuitarBodyTextureDto | undefined | null {
  if (!texture) return texture;
  return {
    scale: texture.scale.get() ?? 1,
    price: texture.price.get() ?? 0,
    backMask: nullOrValue(texture.backMask.get(), texture.backMask.get()?.id),
    backShadowTexture: nullOrValue(texture.backShadowTexture.get(), texture.backShadowTexture.get()?.id),
    backSpecularTexture: nullOrValue(texture.backSpecularTexture.get(), texture.backSpecularTexture.get()?.id),
    frontHoleMask: nullOrValue(texture.frontHoleMask.get(), texture.frontHoleMask.get()?.id),
    mask: nullOrValue(texture.mask.get(), texture.mask.get()?.id!),
    frontShadowTexture: nullOrValue(texture.frontShadowTexture.get(), texture.frontShadowTexture.get()?.id),
    frontSpecularTexture: nullOrValue(texture.frontSpecularTexture.get(), texture.frontSpecularTexture.get()?.id),
    burstBack: nullOrValue(texture.burstBack.get(), texture.burstBack.get()?.id),
    burstTop: nullOrValue(texture.burstTop.get(), texture.burstTop.get()?.id),
  };
}
