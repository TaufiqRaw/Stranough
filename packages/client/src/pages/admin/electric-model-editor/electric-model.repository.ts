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
    isBass?: boolean;
    limit?: number;
  }): [string, { [x: string]: any }] => {
    const option: { [x: string]: any } = {};
    props?.id && (option.id = props?.id);
    props?.page && (option.page = props?.page);
    props?.isBass && (option.isBass = props?.isBass);
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
  const soundHoleLeft = m.spawnPoints.soundHoleLeft.position.get();
  const soundHoleRight = m.spawnPoints.soundHoleRight.position.get();
  const electronicCover = m.spawnPoints.electronicCover.position.get();
  const minorElectronicCover = m.spawnPoints.minorElectronicCover.position.get();
  const batteryCover = m.spawnPoints.batteryCover.position.get();
  const logo = m.spawnPoints.logo.position

  const spawnpoints : ServerDtos.ElectricGuitarModelDto = {
    bridgeSpawnPoint: m.spawnPoints.bridge.position.get()!,
    topSpawnPoint : m.spawnPoints.top.position.get()!,
    bottomSpawnPoint: m.spawnPoints.bottom.position.get()!,
    knobSpawnPoint: knobs.length > 0 ? knobs : null,
    soundHoleSpawnPointLeft: soundHoleLeft ? { ...soundHoleLeft, rotation: m.spawnPoints.soundHoleLeft.rotation.get() } : null,
    soundHoleSpawnPointRight: soundHoleRight ? { ...soundHoleRight, rotation: m.spawnPoints.soundHoleRight.rotation.get() } : null,
    electronicCoverSpawnPoint: electronicCover ? { ...electronicCover, rotation: m.spawnPoints.electronicCover.rotation.get() } : null,
    minorElectronicCoverSpawnPoint: minorElectronicCover ? { ...minorElectronicCover, rotation: m.spawnPoints.minorElectronicCover.rotation.get() } : null,
    batteryCoverSpawnPoint: batteryCover ? { ...batteryCover, rotation: m.spawnPoints.batteryCover.rotation.get() } : null,
    logoSpawnPoint: logo.get() ? { ...logo.get()!, rotation: m.spawnPoints.logo.rotation.get() } : null,
    switchSpawnPoint: switchSp
      ? { ...switchSp, rotation: m.spawnPoints.switch.rotation.get() }
      : null,
    topJackSpawnPoint: topJack
      ? { ...topJack, rotation: m.spawnPoints.jack.top.rotation.get() }
      : null,
    sideJackSpawnPoint: sideJack
      ? { ...sideJack, rotation: m.spawnPoints.jack.side.rotation.get() }
      : null,
  };

  const contours : ServerDtos.ElectricGuitarModelDto = {
    flatContourOverlay : m.flatContourOverlay.get()?.id,
    tummyContourOverlay : m.tummyContourOverlay.get()?.id,
    forearmContourOverlay : m.forearmContourOverlay.get()?.id,
    carvedContourOverlay : m.carvedContourOverlay.get()?.id,
  }

  return {
    name: m.name.get(),
    description: m.description.get(),
    price: m.price.get(),
    thumbnail: m.thumbnail.get()?.id,
    mask: m.mask.get()?.id,
    maskScale : m.maskScale.get(),
    soundHoleScale: m.soundHoleScale.get(),
    mirrorSoundHole: m.mirrorSoundHole.get(),
    isBass: m.isBass.get(),
    ...spawnpoints,
    ...contours,
  };
}