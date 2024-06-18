import { ServerEntities } from "stranough-server";
import { AcousticGuitarModel } from "./types";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { ImageType } from "~/commons/interfaces/image-type";
import { Position } from "~/commons/interfaces/position";
import { createSignal } from "solid-js";
import { createPixiTextureSignal } from "~/commons/functions/create-pixi-texture-signal";

export function createAcousticGuitarModel(
  b?: ServerEntities.AcousticGuitarModel,
  options?: {
    onSave?: (g: AcousticGuitarModel) => () => Promise<void>;
  }
): AcousticGuitarModel {

  const obj: AcousticGuitarModel = {
    id: createSignalObject<number | undefined>(b ? b.id : undefined),
    name: createSignalObject(),
    description: createSignalObject(),
    placeholder: {
      name: createSignalObject(b ? b.name : "Model Name"),
      description: createSignalObject(b ? b.description : "Model Description"),
    },
    thumbnail: createSignalObject<ImageType | undefined>(
      b?.thumbnail && {
        id: b.thumbnail.id,
        // @ts-ignore
        filename: b.thumbnail.filename,
      }
    ),
    price: createSignalObject(b ? b.price : 0),
    maskScale: createSignalObject(b?.maskScale ?? 1),
    selectedCutaway: createSignalObject(),
    getSelectedCutawaySignal: () => {
      switch (obj.selectedCutaway.get()) {
        case "soft":
          return obj.softCutawayMask;
        case "venetian":
          return obj.venetianCutawayMask;
        case "florentine":
          return obj.florentineCutawayMask;
        default:
          return obj.noneCutawayMask;
      }
    },
    getSelectedCutawayBurstSignal: () => {
      switch (obj.selectedCutaway.get()) {
        case "soft":
          return obj.softCutawayBurst;
        case "venetian":
          return obj.venetianCutawayBurst;
        case "florentine":
          return obj.florentineCutawayBurst;
        default:
          return obj.noneCutawayBurst;
      }
    },
    spawnPoints : {
      bridge : {
        isShow : createSignalObject(false),
        position : createSignalObject<Position | undefined>(b?.bridgeSpawnPoint),
      },
      fingerboard : {
        isShow : createSignalObject(false),
        position : createSignalObject<Position | undefined>(b?.fingerboardSpawnPoint),
      },
      fingerboardBackEnd : {
        isShow : createSignalObject(false),
        position : createSignalObject<Position | undefined>(b?.fingerboardBackEndSpawnPoint),
      },
      jack : {
        isShow : createSignalObject(false),
        position : createSignalObject<Position | undefined>(b?.jackSpawnPoint),
        rotation : createSignalObject(b?.jackSpawnPoint?.rotation ?? 0),
      },
      selected : createSignalObject(),
      getSelectedSignal : ()=>{
        switch(obj.spawnPoints.selected.get()){
          case 'bridge':
            return obj.spawnPoints.bridge.position;
          case 'fingerboard':
            return obj.spawnPoints.fingerboard.position;
          case 'fingerboardBackEnd':
            return obj.spawnPoints.fingerboardBackEnd.position;
          case 'jack':
            return obj.spawnPoints.jack.position;
          default : 
            return undefined;
        }
      },
      asArray : ()=>{
        return [
          {position : obj.spawnPoints.fingerboard.position},
          {position : obj.spawnPoints.fingerboardBackEnd.position},
          {position : obj.spawnPoints.bridge.position},
          {position : obj.spawnPoints.jack.position, rotation : obj.spawnPoints.jack.rotation},
        ]
      }
    },
    noneCutawayMask : createSignalObject<ImageType | undefined | null>(
      b?.noneCutawayMask && {
        id: b.noneCutawayMask.id,
        // @ts-ignore
        filename: b.noneCutawayMask.filename,
      }
    ),
    florentineCutawayBurst : createSignalObject<ImageType | undefined | null>(
      b?.florentineCutawayBurst && {
        id: b.florentineCutawayBurst.id,
        // @ts-ignore
        filename: b.florentineCutawayBurst.filename,
      }
    ),
    florentineCutawayMask : createSignalObject<ImageType | undefined | null>(
      b?.florentineCutawayMask && {
        id: b.florentineCutawayMask.id,
        // @ts-ignore
        filename: b.florentineCutawayMask.filename,
      }
    ),
    noneCutawayBurst : createSignalObject<ImageType | undefined | null>(
      b?.noneCutawayBurst && {
        id: b.noneCutawayBurst.id,
        // @ts-ignore
        filename: b.noneCutawayBurst.filename,
      }
    ),
    softCutawayBurst : createSignalObject<ImageType | undefined | null>(
      b?.softCutawayBurst && {
        id: b.softCutawayBurst.id,
        // @ts-ignore
        filename: b.softCutawayBurst.filename,
      }
    ),
    softCutawayMask : createSignalObject<ImageType | undefined | null>(
      b?.softCutawayMask && {
        id: b.softCutawayMask.id,
        // @ts-ignore
        filename: b.softCutawayMask.filename,
      }
    ),
    venetianCutawayBurst : createSignalObject<ImageType | undefined | null>(
      b?.venetianCutawayBurst && {
        id: b.venetianCutawayBurst.id,
        // @ts-ignore
        filename: b.venetianCutawayBurst.filename,
      }
    ),
    venetianCutawayMask : createSignalObject<ImageType | undefined | null>(
      b?.venetianCutawayMask && {
        id: b.venetianCutawayMask.id,
        // @ts-ignore
        filename: b.venetianCutawayMask.filename,
      }
    ),
  };

  if (options?.onSave) {
    obj.save = options.onSave(obj);
  }

  return obj;
}
