import { ServerEntities } from "stranough-server";
import { AcousticGuitarModel } from "./types";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { ImageType } from "~/commons/interfaces/image-type";
import { Position } from "~/commons/interfaces/position";
import { Resource, createMemo, createResource, createSignal } from "solid-js";
import { createPixiTextureSignal } from "~/commons/functions/create-pixi-texture-signal";
import { generateAcousticMask } from "~/commons/functions/generate-acoustic-mask";
import { Texture } from "pixi.js";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";

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
      description: createSignalObject(b?.description ?? "Model Description"),
    },
    thumbnail: createSignalObject<ImageType | undefined>(
      b?.thumbnail && {
        id: b.thumbnail.id,
        // @ts-ignore
        filename: b.thumbnail.filename,
      }
    ),
    price: createSignalObject(b ? b.price : 0),
    mask : (()=>undefined) as Resource<Texture | undefined>,
    normalFullMask : (()=>undefined) as Resource<Texture | undefined>,
    maskScale: createSignalObject(b?.maskScale ?? 1),
    selectedCutaway: createSignalObject(),
    isBeveled : createSignalObject(false),
    getSelectedCutawaySignal: () => {
      switch (obj.selectedCutaway.get()) {
        case "soft":
          return obj.softCutawayMask;
        case "venetian":
          return obj.venetianCutawayMask;
        case "florentine":
          return obj.florentineCutawayMask;
        default:
          return undefined;
      }
    },
    spawnPoints : {
      bridge : {
        isShow : createSignalObject(false),
        position : createSignalObject<Position | undefined>(b?.bridgeSpawnPoint),
      },
      bottomEnd : {
        isShow : createSignalObject(false),
        position : createSignalObject<Position | undefined>(b?.bottomSpawnPoint),
      },
      topEnd : {
        isShow : createSignalObject(false),
        position : createSignalObject<Position | undefined>(b?.topSpawnPoint),
      },
      preamp : {
        isShow : createSignalObject(false),
        position : createSignalObject<Position | undefined>(b?.preampSpawnPoint),
        rotation : createSignalObject(b?.preampSpawnPoint?.rotation ?? 0),
      },

      selected : createSignalObject(),
      getSelectedSignal : ()=>{
        switch(obj.spawnPoints.selected.get()){
          case 'bridge':
            return obj.spawnPoints.bridge.position;
          case 'bottomEnd':
            return obj.spawnPoints.bottomEnd.position;
          case 'topEnd':
            return obj.spawnPoints.topEnd.position;
          case 'preamp':
            return obj.spawnPoints.preamp.position;
          default : 
            return undefined;
        }
      },
      asArray : ()=>{
        return [
          {position : obj.spawnPoints.bottomEnd.position},
          {position : obj.spawnPoints.topEnd.position},
          {position : obj.spawnPoints.bridge.position},
          {position : obj.spawnPoints.preamp.position},
        ]
      }
    },
    normalMask : createSignalObject<ImageType | undefined | null>(
      b?.normalMask && {
        id: b.normalMask.id,
        // @ts-ignore
        filename: b.normalMask.filename,
      }
    ),
    beveledMask : createSignalObject<ImageType | undefined | null>(
      b?.beveledMask && {
        id: b.beveledMask.id,
        // @ts-ignore
        filename: b.beveledMask.filename,
      }
    ),
    florentineCutawayMask : createSignalObject<ImageType | undefined | null>(
      b?.florentineCutawayMask && {
        id: b.florentineCutawayMask.id,
        // @ts-ignore
        filename: b.florentineCutawayMask.filename,
      }
    ),
    softCutawayMask : createSignalObject<ImageType | undefined | null>(
      b?.softCutawayMask && {
        id: b.softCutawayMask.id,
        // @ts-ignore
        filename: b.softCutawayMask.filename,
      }
    ),
    venetianCutawayMask : createSignalObject<ImageType | undefined | null>(
      b?.venetianCutawayMask && {
        id: b.venetianCutawayMask.id,
        // @ts-ignore
        filename: b.venetianCutawayMask.filename,
      }
    ),
    loadedMask : {} as any,
  };

  if (options?.onSave) {
    obj.save = options.onSave(obj);
  }

  async function loadImg(imgUrl : string){
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = serverImgUrl(imgUrl)!;
    await img.decode();
    return img;
  }

  obj.loadedMask = {
    beveledMask : createResource(obj.beveledMask.get, async (mask)=>await loadImg(mask.filename!))[0],
    normalMask : createResource(obj.normalMask.get, async (mask)=>await loadImg(mask.filename!))[0],
    softCutawayMask : createResource(obj.softCutawayMask.get, async (mask)=>await loadImg(mask.filename!))[0],
    venetianCutawayMask : createResource(obj.venetianCutawayMask.get, async (mask)=>await loadImg(mask.filename!))[0],
    florentineCutawayMask : createResource(obj.florentineCutawayMask.get, async (mask)=>await loadImg(mask.filename!))[0],
  };

  obj.mask = createMemo(()=>{
    let leftMask = obj.isBeveled.get() ? obj.loadedMask.beveledMask() : obj.loadedMask.normalMask();
    let rightMask = obj.getSelectedCutawaySignal()?.get() ? obj.loadedMask[`${obj.selectedCutaway.get()!}CutawayMask`]() : leftMask;
    if(!leftMask || !rightMask) return undefined;

    return generateAcousticMask(leftMask, rightMask, {
      flipRight : !obj.selectedCutaway.get(),
    });
  })

  obj.normalFullMask = createMemo(()=>{
    let leftMask = obj.loadedMask.normalMask();
    let rightMask = obj.loadedMask.normalMask();
    if(!leftMask || !rightMask) return undefined;

    return generateAcousticMask(leftMask, rightMask, {
      flipRight : true,
  })});

  return obj;
}
