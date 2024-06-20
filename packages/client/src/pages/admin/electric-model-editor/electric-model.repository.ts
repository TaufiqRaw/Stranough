import { ServerDtos, ServerEntities } from "stranough-server";
import { axios } from "~/commons/axios-instance";
import {
  AvailableBackContour,
  AvailableTopContour,
  GuitarBody,
  GuitarBodyContour,
  GuitarBodyTextureKeyType,
  ElectricModel,
  GuitarModelBodyKeyType,
} from "./utils/types";
import { createModel } from "./utils/functions/create-model";
import { Owner, runWithOwner } from "solid-js";
import { nullOrValue } from "~/commons/functions/null-or-value";

export const electricModelRepository = {
  async index(
    page: number,
    options?: {
      isElectric?: boolean,
      limit?: number,
      deep?: boolean;
    }
  ) {
    const { data } = await axios.get<[ServerEntities.ElectricGuitarModel[], number]>(
      `/electric-guitars${options?.deep ? "/deep" : ""}?page=${page}${
        options?.isElectric !== undefined ? `&isElectric=${options?.isElectric}` : ""
      }${options?.limit ? `&limit=${options?.limit}` : ""}`
    );
    return data[0];
  },

  async get(
    id: number,
    options: {
      onSave?: (m: ElectricModel) => () => Promise<void>;
      owner: Owner;
      selectedBody?: GuitarModelBodyKeyType;
      selectedTopContour?: AvailableTopContour;
      selectedBackContour?: AvailableBackContour;
    }
  ) {
    const { data } = await axios.get<
      ServerEntities.ElectricGuitarModel & {
        selectedBody: GuitarModelBodyKeyType | undefined;
        selectedTopContour: GuitarBodyTextureKeyType | undefined;
        selectedBackContour: GuitarBodyTextureKeyType | undefined;
      }
    >(`/electric-guitars/${id}`);
    data.selectedBody = options.selectedBody;
    data.selectedTopContour = options.selectedTopContour;
    data.selectedBackContour = options.selectedBackContour;
    return runWithOwner(options?.owner, () => {
      return createModel(
        data,
        options ? { onSave: options.onSave } : undefined
      );
    });
  },

  async create(m: ElectricModel) {
    const dto = signalToDto(m);
    const { data } = await axios.post<ServerEntities.ElectricGuitarModel>(
      "/electric-guitars",
      dto
    );
    return data;
  },

  async update(m: ElectricModel) {
    const dto = signalToDto(m);
    const { data } = await axios.put<void>(`/electric-guitars/${m.id.get()}`, dto);
  },

  async delete(id: number) {
    const { data } = await axios.delete<void>(`/electric-guitars/${id}`);
  },

  queryKey: (props?: {
    id?: number;
    page?: number;
    isElectric?: boolean;
    limit?: number;
  }): [string, { [x: string]: any }] => {
    const option: { [x: string]: any } = {};
    props?.id && (option.id = props?.id);
    props?.page && (option.page = props?.page);
    props?.isElectric && (option.isElectric = props?.isElectric);
    props?.limit && (option.limit = props?.limit);

    return ["electric-guitars", option];
  },
};

//TODO: add validation for stringSpawnPoint, count, texture
function signalToDto(m: ElectricModel): ServerDtos.ElectricGuitarModelDto {
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
    maskScale : m.maskScale.get(),
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
    backMask: nullOrValue(body.backMask.get(), body.backMask.get()?.id),
    burstTop: nullOrValue(body.burstTop.get(), body.burstTop.get()?.id),
    burstBack: nullOrValue(body.burstBack.get(), body.burstBack.get()?.id),
    backCarvedContour : bodyTextureToServerDto(body.backCarvedContour.get()),
    backFlatContour : bodyTextureToServerDto(body.backFlatContour.get()),
    backTummyContour : bodyTextureToServerDto(body.backTummyContour.get()),
    topCarvedContour : bodyTextureToServerDto(body.topCarvedContour.get()),
    topFlatContour : bodyTextureToServerDto(body.topFlatContour.get()),
    topForearmContour : bodyTextureToServerDto(body.topForearmContour.get()),
  };
}

//TODO: add validation for mask
function bodyTextureToServerDto(
  texture: GuitarBodyContour | null | undefined
): ServerDtos.GuitarBodyContourDto | undefined | null {
  if (!texture) return texture;
  return {
    price: texture.price.get() ?? 0,
    shadowTexture: nullOrValue(
      texture.shadowTexture.get(),
      texture.shadowTexture.get()?.id
    ),
    specularTexture: nullOrValue(
      texture.specularTexture.get(),
      texture.specularTexture.get()?.id
    )
  };
}
