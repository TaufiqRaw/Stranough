import { createSignalObject } from "~/commons/functions/signal-object.util";
import { batch, createMemo, createResource, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { Position } from "~/commons/interfaces/position";
import * as R from "remeda";
import { ImageType } from "~/commons/interfaces/image-type";
import { ElectricModel, SpawnPointType } from "../types";
import { ElectricModel as ElectricModelConfig } from "stranough-common";
import { axios } from "~/commons/axios-instance";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import {parse} from 'svgson'
import { getPointsFromSVG } from "~/commons/functions/get-points-from-svg";
import { DOMAdapter, ImageSource, Texture } from "pixi.js";
import { generateBurstTexture } from "~/commons/functions/generate-burst-texture";
import { createPickguard } from "~/pages/admin/pickguard-editor/utils/create-pickguard";

function createSpawnPoint(props?: Position): SpawnPointType {
  return {
    isShow: createSignalObject<boolean>(false),
    position: createSignalObject<Position | undefined>(props ?? undefined),
  };
}


export function createModel(
  props?: ServerEntities.ElectricGuitarModel & {
    selectedConstruction?: typeof ElectricModelConfig.constructionKeys[number];
    selectedTopContour?: Exclude<typeof ElectricModelConfig.contourKeys[number], 'tummyContour'>;
    selectedBackContour?: Exclude<typeof ElectricModelConfig.contourKeys[number], "forearmContour">;
  },
  options ?: {
    onSave ?: (g :ElectricModel)=>()=>Promise<void>,
}):ElectricModel{
  const [knobs, setKnobs] = createSignal<SignalObject<Position | undefined>[]>(
    props?.knobSpawnPoint?.map((x) => createSignalObject<Position | undefined>(x)) ?? []
  );
  const selectedKnobIndex = createSignalObject<number>();

  const obj : ElectricModel = {
    id : createSignalObject(props?.id),
    name : createSignalObject(),
    description : createSignalObject(),
    placeholder : {
      name : createSignalObject(props?.name || "Model Name"),
      description : createSignalObject(props?.description || "Model Description"),
    },
    price : createSignalObject(props?.price ?? 0),
    maskScale : createSignalObject(props?.maskScale ?? 1),
    soundHoleScale : createSignalObject(props?.soundHoleScale ?? 1),
    mirrorSoundHole : createSignalObject(props?.mirrorSoundHole ?? false),
    isBass : createSignalObject(props?.isBass ?? false),

    selectedConstruction : createSignalObject(props?.selectedConstruction ?? undefined),
    bridgeToBottom : createSignalObject(props?.bridgeToBottom ?? 0),

    //@ts-ignore
    mask : createSignalObject(props?.mask ?? null),
    //@ts-ignore
    electronicCoverOverlay : createSignalObject(props?.electronicCoverOverlay ?? null),
    
    //@ts-ignore
    flatContourOverlay : createSignalObject(props?.flatContourOverlay ?? null),
    //@ts-ignore
    forearmContourOverlay : createSignalObject(props?.forearmContourOverlay ?? null),
    //@ts-ignore
    tummyContourOverlay : createSignalObject(props?.tummyContourOverlay ?? null),
    //@ts-ignore
    carvedContourOverlay : createSignalObject(props?.carvedContourOverlay ?? null),
    
    //@ts-ignore
    thumbnail : createSignalObject(props?.thumbnail ?? null),

    selectedTopContour : createSignalObject(props?.selectedTopContour ?? undefined),

    selectedPickguard : createSignalObject(props?.pickguards?.[0] 
      ? createPickguard(props.pickguards[0])  
      : undefined),

    getSelectedTopContourSignal() {
      switch (obj.selectedTopContour.get()) {
        case "flatContour":
          return obj.flatContourOverlay;
        case "forearmContour":
          return obj.forearmContourOverlay;
        case "carvedContour":
          return obj.carvedContourOverlay;
        default:
          return undefined;
      }
    },

    selectedBackContour : createSignalObject(props?.selectedBackContour ?? undefined),

    getSelectedBackContourSignal() {
      switch (obj.selectedBackContour.get()) {
        case "flatContour":
          return obj.flatContourOverlay;
        case "tummyContour":
          return obj.tummyContourOverlay;
        case "carvedContour":
          return obj.carvedContourOverlay;
        default:
          return undefined;
      }
    },

    spawnPoints: {
      selected: createSignalObject(),
      hovered: createSignalObject(),
      getSelectedSignal: () => {
        switch (obj.spawnPoints.selected.get()) {
          case "bridge":
            return {
              get: obj.spawnPoints.bridge.position.get,
              set: (pos)=>{
                if(!pos) return;
                const lastPos = obj.spawnPoints.bridge.position.get() ?? {x:0, y:0};
                batch(()=>{
                  obj.spawnPoints.bridge.position.set(pos);
                  if(typeof pos === 'function'){
                    obj.spawnPoints.bottom.position.set({
                      x : pos(lastPos)?.x ?? 0,
                      y : (obj.spawnPoints.bottom.position.get()?.y ?? 0) /* + (pos({x: 0, y:0})?.y ?? 0), // uncomment if you want to add bridge movement to end pos*/
                    });
                    obj.spawnPoints.top.position.set({
                      x : pos(lastPos)?.x ?? 0,
                      y : (obj.spawnPoints.top.position.get()?.y ?? 0) /* + (pos({x: 0, y:0})?.y ?? 0), // uncomment if you want to add bridge movement to end pos */
                    });
                  }else{
                    obj.spawnPoints.bottom.position.set({
                      x : pos.x,
                      y : obj.spawnPoints.bottom.position.get()?.y ?? 0
                    });
                    obj.spawnPoints.top.position.set({
                      x : pos.x,
                      y : obj.spawnPoints.top.position.get()?.y ?? 0
                    });
                  }
                })
              }
            };
          case "bottomEnd" : 
            return {
              get: obj.spawnPoints.bottom.position.get,
              set: (pos)=>{
                if(!pos) return;
                if(typeof pos === 'function'){
                  obj.spawnPoints.bottom.position.set({
                    x : obj.spawnPoints.bridge.position.get()?.x ?? 0,
                    y : pos(obj.spawnPoints.bottom.position.get())?.y ?? 0,
                  });
                }else{
                  obj.spawnPoints.bottom.position.set({
                    x : obj.spawnPoints.bridge.position.get()?.x ?? 0,
                    y : pos.y,
                  });
                }
              },
            };
          case "topEnd" :
            return {
              get: obj.spawnPoints.top.position.get,
              set: (pos)=>{
                if(!pos) return;
                if(typeof pos === 'function'){
                  obj.spawnPoints.top.position.set({
                    x : obj.spawnPoints.bridge.position.get()?.x ?? 0,
                    y : pos(obj.spawnPoints.top.position.get())?.y ?? 0,
                  });
                }else {
                  obj.spawnPoints.top.position.set({
                    x : obj.spawnPoints.bridge.position.get()?.x ?? 0,
                    y : pos.y,
                  });
                }
              },
            };
          case "switch":
            return {
              get: obj.spawnPoints.switch.position.get,
              set: obj.spawnPoints.switch.position.set,
            };
          case "jackSide":
            return {
              get: obj.spawnPoints.jack.side.position.get,
              set: obj.spawnPoints.jack.side.position.set,
            };
          case "jackTop":
            return {
              get: obj.spawnPoints.jack.top.position.get,
              set: obj.spawnPoints.jack.top.position.set,
            };
          case "knobs":
            return (typeof selectedKnobIndex.get() !== 'undefined' && knobs()[selectedKnobIndex.get()!]) 
            ? {
              get: knobs()[selectedKnobIndex.get()!].get,
              set: knobs()[selectedKnobIndex.get()!].set
            } : undefined;
          case "soundHoleLeft":
            return {
              get: obj.spawnPoints.soundHoleLeft.position.get,
              set: obj.spawnPoints.soundHoleLeft.position.set,
            };
          case "soundHoleRight":
            return {
              get: obj.spawnPoints.soundHoleRight.position.get,
              set: obj.spawnPoints.soundHoleRight.position.set,
            };
          case "electronicCover":
            return {
              get: obj.spawnPoints.electronicCover.position.get,
              set: obj.spawnPoints.electronicCover.position.set,
            };
          case "minorElectronicCover":
            return {
              get: obj.spawnPoints.minorElectronicCover.position.get,
              set: obj.spawnPoints.minorElectronicCover.position.set,
            };
          case "batteryCover":
            return {
              get: obj.spawnPoints.batteryCover.position.get,
              set: obj.spawnPoints.batteryCover.position.set,
            };
          case "logo":
            return {
              get: obj.spawnPoints.logo.position.get,
              set: obj.spawnPoints.logo.position.set,
            };
          default:
            return undefined;
        }
      },
      bridge: createSpawnPoint(props?.bridgeSpawnPoint),
      
      batteryCover: {
        ...createSpawnPoint(props?.batteryCoverSpawnPoint),
        rotation: createSignalObject<number>(
          props?.batteryCoverSpawnPoint?.rotation ?? 0
        ),
      },
      electronicCover: {
        ...createSpawnPoint(props?.electronicCoverSpawnPoint),
        rotation: createSignalObject<number>(
          props?.electronicCoverSpawnPoint?.rotation ?? 0
        ),
      },
      logo: {
        ...createSpawnPoint(props?.logoSpawnPoint),
        rotation: createSignalObject<number>(props?.logoSpawnPoint?.rotation ?? 0),
      },
      minorElectronicCover: {
        ...createSpawnPoint(props?.minorElectronicCoverSpawnPoint),
        rotation: createSignalObject<number>(
          props?.minorElectronicCoverSpawnPoint?.rotation ?? 0
        ),
      },
      soundHoleLeft : {
        ...createSpawnPoint(props?.soundHoleSpawnPointLeft),
        rotation: createSignalObject<number>(
          props?.soundHoleSpawnPointLeft?.rotation ?? 0
        ),
      },
      soundHoleRight : {
        ...createSpawnPoint(props?.soundHoleSpawnPointRight),
        rotation: createSignalObject<number>(
          props?.soundHoleSpawnPointRight?.rotation ?? 0
        ),
      },
      switch: {
        ...createSpawnPoint(props?.switchSpawnPoint),
        rotation: createSignalObject<number>(
          props?.switchSpawnPoint?.rotation ?? 0
        ),
      },
      jack: {
        side: {
          ...createSpawnPoint(props?.sideJackSpawnPoint),
          rotation: createSignalObject<number>(
            props?.sideJackSpawnPoint?.rotation ?? 0
          ),
        },
        top: {
          ...createSpawnPoint(props?.topJackSpawnPoint),
          rotation: createSignalObject<number>(
            props?.topJackSpawnPoint?.rotation ?? 0
          ),
        },
      },
      bottom : createSpawnPoint(props?.bottomSpawnPoint ?? undefined),
      top : createSpawnPoint(props?.topSpawnPoint ?? undefined),
      
      asArray: () => [
        ...R.pipe(
          obj.spawnPoints,
          R.pick(["bridge", "bottom", "top"]),
          R.values,
          R.map((x) => ({position : x.position}))
        ),
        ...R.pipe(
          obj.spawnPoints.knobs.get(),
          R.map((x) => ({position : x}))
        ),
        ...R.pipe(
          [obj.spawnPoints.switch, obj.spawnPoints.electronicCover, obj.spawnPoints.minorElectronicCover, obj.spawnPoints.batteryCover, obj.spawnPoints.logo, obj.spawnPoints.soundHoleLeft, obj.spawnPoints.soundHoleRight],
          R.map((x) => ({position : x.position, rotation: x.rotation})),
        ),
        ...R.pipe(
          obj.spawnPoints.jack,
          R.values,
          R.map((x) => ({position:x.position, rotation: x.rotation})),
        ),
      ],
      knobs: {
        get: knobs,
        addKnobs() {
          setKnobs([...knobs(), createSignalObject<Position>()]);
        },
        removeKnobs(i: number) {
          batch(() => {
            setKnobs(knobs().filter((_, index) => index !== i));
            selectedKnobIndex.set(undefined);
          });
        },
        selectedKnobIndex,
      },
    },
  }
  obj.maskBordersPoints = createResource(obj.mask.get, async (mask)=>{
    try{
      const url = serverImgUrl(mask.filename)!;
      const {data} = await axios.get(url);
      const points = await getPointsFromSVG(data);
      if(points.length === 0) return undefined;
      
      //determine if the points are in clockwise or counter clockwise order
      let sum = 0;
      for(let i = 0; i < points.length; i++){
        const p1 = points[i];
        const p2 = points[(i+1)%points.length];
        sum += (p2.x - p1.x)*(p2.y + p1.y);
      }
      if(sum < 0){
        points.reverse()
      }
      

      // points.push(points[0]);
      return points;
    }catch(err){
      console.error(err);
      return undefined;
    }
  })[0];

  obj.leftMostPoint = createMemo(()=>{
    const res = obj.maskBordersPoints()?.reduce((acc, cur)=>{
      if(cur.x < acc.x) return cur;
      return acc;
    }, {x: Infinity, y: 0});
    return {
      x: (res?.x ?? 0)*obj.maskScale.get(),
      y: (res?.y ?? 0)*obj.maskScale.get(),
    }
})

  if(options?.onSave){
    obj.save = options.onSave(obj);
  }
  return obj;
}