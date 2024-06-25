import { createSignalObject } from "~/commons/functions/signal-object.util";
import { batch, createMemo, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { Position } from "~/commons/interfaces/position";
import * as R from "remeda";
import { ImageType } from "~/commons/interfaces/image-type";
import { ElectricModel, SpawnPointType } from "../types";
import { ElectricModel as ElectricModelConfig } from "stranough-common";

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
    boltOnConstruction : {
      //@ts-ignore
      mask : createSignalObject<ImageType | null | undefined>(props?.boltOnConstructionMask ?? null),
    },
    neckThroughConstruction : {
      //@ts-ignore
      mask : createSignalObject<ImageType | null | undefined>(props?.neckThroughConstructionMask ?? null),
    },
    setInConstruction : {
      //@ts-ignore
      mask : createSignalObject<ImageType | null | undefined>(props?.setInConstructionMask ?? null),
    },

    flatContour : {
      //@ts-ignore
      shadow : createSignalObject<ImageType | null | undefined>(props?.flatContourShadow ?? null),
      //@ts-ignore
      spec : createSignalObject<ImageType | null | undefined>(props?.flatContourSpec ?? null),
    },

    forearmContour : {
      //@ts-ignore
      shadow : createSignalObject<ImageType | null | undefined>(props?.forearmContourShadow ?? null),
      //@ts-ignore
      spec : createSignalObject<ImageType | null | undefined>(props?.forearmContourSpec ?? null),
    },

    tummyContour : {
      //@ts-ignore
      shadow : createSignalObject<ImageType | null | undefined>(props?.tummyContourShadow ?? null),
      //@ts-ignore
      spec : createSignalObject<ImageType | null | undefined>(props?.tummyContourSpec ?? null),
    },

    carvedContour : {
      //@ts-ignore
      shadow : createSignalObject<ImageType | null | undefined>(props?.carvedContourShadow ?? null),
      //@ts-ignore
      spec : createSignalObject<ImageType | null | undefined>(props?.carvedContourSpec ?? null),
    },
    
    //@ts-ignore
    thumbnail : createSignalObject<ImageType | null | undefined>(props?.thumbnail ?? null),

    selectedConstruction : createSignalObject<typeof ElectricModelConfig.constructionKeys[number] | undefined>(
      props?.selectedConstruction ?? 
      ElectricModelConfig.constructionKeys.filter(m=>props?.[`${m}Mask`] !== undefined)[0]
    ),

    getSelectedConstructionSignal : () =>{
      switch (obj.selectedConstruction.get()) {
        case 'boltOnConstruction' : 
          return obj.boltOnConstruction;
        case 'neckThroughConstruction' :
          return obj.neckThroughConstruction;
        case 'setInConstruction' :
          return obj.setInConstruction;
        default:
          return undefined;
      }
    },

    selectedTopContour : createSignalObject(props?.selectedTopContour ?? undefined),

    getSelectedTopContourSignal() {
      switch (obj.selectedTopContour.get()) {
        case "flatContour":
          return obj.flatContour;
        case "forearmContour":
          return obj.forearmContour;
        case "carvedContour":
          return obj.carvedContour;
        default:
          return undefined;
      }
    },

    selectedBackContour : createSignalObject(props?.selectedBackContour ?? undefined),

    getSelectedBackContourSignal() {
      switch (obj.selectedBackContour.get()) {
        case "flatContour":
          return obj.flatContour;
        case "tummyContour":
          return obj.tummyContour;
        case "carvedContour":
          return obj.carvedContour;
        default:
          return undefined;
      }
    },

    spawnPoints: {
      selected: createSignalObject(),
      hovered: createSignalObject(),
      getSelectedSignal: () => {
        switch (obj.spawnPoints.selected.get()) {
          case "fingerboard":
            return {
              get: obj.spawnPoints.fingerboard.position.get,
              set: obj.spawnPoints.fingerboard.position.set,
            };
          case "bridge":
            return {
              get: obj.spawnPoints.bridge.position.get,
              set: obj.spawnPoints.bridge.position.set,
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
          case "pickupBridge":
            return {
              get: obj.spawnPoints.pickup.bridge.position.get,
              set: obj.spawnPoints.pickup.bridge.position.set,
            };
          case "pickupMiddle":
            return {
              get: obj.spawnPoints.pickup.middle.position.get,
              set: obj.spawnPoints.pickup.middle.position.set,
            };
          case "pickupNeck":
            return {
              get: obj.spawnPoints.pickup.neck.position.get,
              set: obj.spawnPoints.pickup.neck.position.set,
            };
          case "knobs":
            return (typeof selectedKnobIndex.get() !== 'undefined' && knobs()[selectedKnobIndex.get()!]) 
            ? {
              get: knobs()[selectedKnobIndex.get()!].get,
              set: knobs()[selectedKnobIndex.get()!].set
            } : undefined;
          case "fingerboardBackEnd" :
            return {
              get: obj.spawnPoints.fingerboardBackEnd.position.get,
              set: obj.spawnPoints.fingerboardBackEnd.position.set,
            }
          case "pickguard" :
            return {
              get: obj.spawnPoints.pickguard.position.get,
              set: obj.spawnPoints.pickguard.position.set,
            }
          default:
            return undefined;
        }
      },
      fingerboard: createSpawnPoint(props?.fingerboardSpawnPoint),
      fingerboardBackEnd: createSpawnPoint(props?.fingerboardBackEndSpawnPoint),
      bridge: createSpawnPoint(props?.bridgeSpawnPoint),
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
      pickup: {
        neck: createSpawnPoint(props?.pickupSpawnPoint?.neck),
        middle: createSpawnPoint(props?.pickupSpawnPoint?.middle),
        bridge: createSpawnPoint(props?.pickupSpawnPoint?.bridge),
        remove(name: "neck" | "middle" | "bridge") {
          switch (name) {
            case "neck":
              this.neck.position.set(undefined);
              break;
            case "middle":
              this.middle.position.set(undefined);
              break;
            case "bridge":
              this.bridge.position.set(undefined);
              break;
          }
        },
      },
      pickguard: createSpawnPoint(props?.pickguardSpawnPoint),
      asArray: () => [
        ...R.pipe(
          obj.spawnPoints,
          R.pick(["bridge", "fingerboard", 'fingerboardBackEnd', 'pickguard']),
          R.values,
          R.map((x) => ({position : x.position}))
        ),
        ...R.pipe(
          obj.spawnPoints.pickup,
          R.pick(["neck", "middle", "bridge"]),
          R.values,
          R.map((x) => ({position : x.position}))
        ),
        ...R.pipe(
          obj.spawnPoints.knobs.get(),
          R.map((x) => ({position : x}))
        ),
        R.pipe(
          obj.spawnPoints.switch,
          x=>({position:x.position, rotation: x.rotation}),
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
  if(options?.onSave){
    obj.save = options.onSave(obj);
  }
  return obj;
}