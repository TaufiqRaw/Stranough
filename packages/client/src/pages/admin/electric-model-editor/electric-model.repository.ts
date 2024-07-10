import { ServerDtos, ServerEntities } from "stranough-server";
import { axios } from "~/commons/axios-instance";
import { createModel } from "./utils/functions/create-electric-model";
import { Owner, runWithOwner } from "solid-js";
import { ElectricModel } from "./utils/types";
import {ElectricModel as ElectricModelConfig} from "stranough-common"
import * as R from "remeda";
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
    console.log(data);
    return data[0];
  },

  async get(
    id: number,
    options: {
      onSave?: (m: ElectricModel) => () => Promise<void>;
      owner: Owner;
      selectedConstruction?: typeof ElectricModelConfig.constructionKeys[number];
      selectedTopContour?: Exclude<typeof ElectricModelConfig.contourKeys[number], 'tummyContour'>;
      selectedBackContour?: Exclude<typeof ElectricModelConfig.contourKeys[number], 'forearmContour'>;
    }
  ) {
    const { data } = await axios.get<
      ServerEntities.ElectricGuitarModel & {
        selectedConstruction?: typeof ElectricModelConfig.constructionKeys[number] | undefined;
        selectedTopContour?: Exclude<typeof ElectricModelConfig.contourKeys[number], 'tummyContour'>;
        selectedBackContour?: Exclude<typeof ElectricModelConfig.contourKeys[number], 'forearmContour'>;
      }
    >(`/electric-guitars/${id}`);
    data.selectedConstruction = options.selectedConstruction;
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

  const spawnpoints : ServerDtos.ElectricGuitarModelDto = {
    bridgeSpawnPoint: m.spawnPoints.bridge.position.get()!,
    fingerboardSpawnPoint: m.spawnPoints.fingerboard.position.get()!,
    pickupSpawnPoint: {
      neck: m.spawnPoints.pickup.neck.position.get(),
      bridge: m.spawnPoints.pickup.bridge.position.get(),
      middle: m.spawnPoints.pickup.middle.position.get(),
    },
    pickguardSpawnPoint: m.spawnPoints.pickguard.position.get(),
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

  const masks = R.pipe(
    m,
    R.pick(ElectricModelConfig.constructionKeys),
    R.mapValues((x)=>nullOrValue(x.mask.get(), x.mask.get()?.id)),
    R.mapKeys((k)=>k+"Mask"),
  )

  const shadow = R.pipe(
    m,
    R.pick(ElectricModelConfig.contourKeys),
    R.mapValues((x)=>nullOrValue(x.shadow.get(), x.shadow.get()?.id)),
    R.mapKeys((k)=>k+"Shadow"),
  )

  const spec = R.pipe(
    m,
    R.pick(ElectricModelConfig.contourKeys),
    R.mapValues((x)=>nullOrValue(x.spec.get(), x.spec.get()?.id)),
    R.mapKeys((k)=>k+"Spec"),
  )

  return {
    name: m.name.get(),
    description: m.description.get(),
    price: m.price.get(),
    maskScale : m.maskScale.get(),
    thumbnail: m.thumbnail.get()?.id,
    ...masks,
    ...shadow,
    ...spec,
    ...spawnpoints,
  };
}