import { createSignalObject } from "~/commons/functions/signal-object.util";
import { GuitarBody, GuitarBodyTextureKeyType, GuitarModel, GuitarModelBodyKeyType, SpawnPointType } from "../types";
import { createGuitarBody } from "./create-guitar-body";
import { batch, createMemo, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { Position } from "~/commons/interfaces/position";
import { GuitarBodySPEnum } from "../constant";
import * as R from "remeda";
import { ImageType } from "~/commons/interfaces/image-type";

function createSpawnPoint(props?: Position): SpawnPointType {
  return {
    isShow: createSignalObject<boolean>(false),
    position: createSignalObject<Position | undefined>(props ?? undefined),
  };
}


export function createModel(
  props?: ServerEntities.GuitarModel & {
    neckThroughBody?: ServerEntities.GuitarBody & {selectedBodyTexture?: GuitarBodyTextureKeyType},
    setInBody?: ServerEntities.GuitarBody & {selectedBodyTexture?: GuitarBodyTextureKeyType},
    boltOnBody?: ServerEntities.GuitarBody & {selectedBodyTexture?: GuitarBodyTextureKeyType},
  } & {selectedBody?: GuitarModelBodyKeyType} & {selectedBodyTexture?: GuitarBodyTextureKeyType},
  options ?: {
    onSave ?: (g :GuitarModel)=>()=>Promise<void>,
}):GuitarModel{
  const [selectedBody, setSelectedBody] = createSignal<GuitarModelBodyKeyType | undefined>(props?.boltOnBody ? "boltOnBody" : props?.neckThroughBody ? "neckThroughBody" : props?.setInBody ? "setInBody" : undefined);
  const [knobs, setKnobs] = createSignal<SignalObject<Position | undefined>[]>(
    props?.knobSpawnPoint?.map((x) => createSignalObject<Position | undefined>(x)) ?? []
  );
  const selectedKnobIndex = createSignalObject<number>();

  switch(props?.selectedBody){
    case 'boltOnBody':
      props.boltOnBody && (props.boltOnBody.selectedBodyTexture = props.selectedBodyTexture);
      break;
    case 'neckThroughBody':
      props.neckThroughBody && (props.neckThroughBody.selectedBodyTexture = props.selectedBodyTexture);
      break;
    case 'setInBody':
      props.setInBody && (props.setInBody.selectedBodyTexture = props.selectedBodyTexture);
      break;
  }

  const obj : GuitarModel = {
    id : createSignalObject(props?.id),
    name : createSignalObject(),
    description : createSignalObject(),
    placeholder : {
      name : createSignalObject(props?.name || "Model Name"),
      description : createSignalObject(props?.description || "Model Description"),
    },
    price : createSignalObject(props?.price ?? 0),
    isElectric : createSignalObject(props?.isElectric ?? true),
    allowSingleCoilPickup : createSignalObject(props?.allowSingleCoilPickup ?? true),
    selectedBody : {
      get : selectedBody,
      set : (x)=>{
        if(!!x && !obj[x].get()){
          obj[x].set(createGuitarBody());
        }
        setSelectedBody(x);
    }},
    getSelectedBodySignal: ()=>{
      if(!selectedBody()) return undefined;
      return obj[selectedBody()!].get();
    },
    thumbnail : createSignalObject<ImageType | null | undefined>(props?.thumbnail ?? null),
    neckThroughBody : createSignalObject<GuitarBody | null | undefined>(
      props?.neckThroughBody ? createGuitarBody(props.neckThroughBody) : undefined
    ),
    setInBody : createSignalObject<GuitarBody | null | undefined>(
      props?.setInBody ? createGuitarBody(props.setInBody) : undefined
    ),
    boltOnBody : createSignalObject<GuitarBody | null | undefined>(
      props?.boltOnBody ? createGuitarBody(props.boltOnBody) : undefined
    ),
    spawnPoints: {
      selected: createSignalObject<GuitarBodySPEnum>(),
      hovered: createSignalObject<GuitarBodySPEnum>(),
      getSelectedSignal: () => {
        switch (obj.spawnPoints.selected.get()) {
          case GuitarBodySPEnum.fingerboard:
            return {
              get: obj.spawnPoints.fingerboard.position.get,
              set: obj.spawnPoints.fingerboard.position.set,
            };
          case GuitarBodySPEnum.bridge:
            return {
              get: obj.spawnPoints.bridge.position.get,
              set: obj.spawnPoints.bridge.position.set,
            };
          case GuitarBodySPEnum.switch:
            return {
              get: obj.spawnPoints.switch.position.get,
              set: obj.spawnPoints.switch.position.set,
            };
          case GuitarBodySPEnum.jackSide:
            return {
              get: obj.spawnPoints.jack.side.position.get,
              set: obj.spawnPoints.jack.side.position.set,
            };
          case GuitarBodySPEnum.jackTop:
            return {
              get: obj.spawnPoints.jack.top.position.get,
              set: obj.spawnPoints.jack.top.position.set,
            };
          case GuitarBodySPEnum.pickupBridge:
            return {
              get: obj.spawnPoints.pickup.bridge.position.get,
              set: obj.spawnPoints.pickup.bridge.position.set,
            };
          case GuitarBodySPEnum.pickupMiddle:
            return {
              get: obj.spawnPoints.pickup.middle.position.get,
              set: obj.spawnPoints.pickup.middle.position.set,
            };
          case GuitarBodySPEnum.pickupNeck:
            return {
              get: obj.spawnPoints.pickup.neck.position.get,
              set: obj.spawnPoints.pickup.neck.position.set,
            };
          case GuitarBodySPEnum.knobs:
            return {
              get: selectedKnobIndex.get()
                ? knobs()[selectedKnobIndex.get()!].get
                : () => undefined,
              set:
                selectedKnobIndex.get() !== undefined
                  ? knobs()[selectedKnobIndex.get()!].set
                  : () => undefined,
            };
          default:
            return {
              get: () => undefined,
              set: () => undefined,
            };
        }
      },
      fingerboard: createSpawnPoint(props?.fingerboardSpawnPoint),
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
      asArray: () => [
        ...R.pipe(
          obj.spawnPoints,
          R.pick(["bridge", "fingerboard"]),
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