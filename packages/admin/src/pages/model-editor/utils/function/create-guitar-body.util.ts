import {
  Accessor,
  Signal,
  batch,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { ServerEntities } from "stranough-server";
import {
  GuitarBody,
  GuitarBodyTextureKeyType,
  GuitarBodyTexture,
  SpawnPointType,
} from "../types";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { SignalObject } from "~/commons/interfaces/signal-object.interface";
import { GuitarBodySPEnum } from "../constant";
import { Position } from "~/commons/interfaces/position.interface";
import { createBodyTexture } from "./create-body-texture";
import * as R from "remeda";

function createSpawnPoint(props?: Position): SpawnPointType {
  return {
    isShow: createSignalObject<boolean>(false),
    position: createSignalObject<Position | undefined>(props || undefined),
  };
}

export function createGuitarBody(
  props?: ServerEntities.GuitarBody
): GuitarBody {
  const [knobs, setKnobs] = createSignal<SignalObject<Position | undefined>[]>(
    []
  );
  const selectedKnobIndex = createSignalObject<number>();
  const [selectedBodyTexture, setSelectedBodyTexture] = createSignal<
    GuitarBodyTextureKeyType | undefined
  >();

  const signal: GuitarBody = {
    id: createSignalObject<number | undefined>(props?.id),
    selectedBodyTexture: {
      get: selectedBodyTexture,
      set: (x) => {
        if (!!x && !signal[x].get()) {
          signal[x].set(createBodyTexture());
        }
        setSelectedBodyTexture(x);
      },
    },
    getSelectedBodyTextureSignal: createMemo(() => {
      if (!selectedBodyTexture()) return undefined;
      return signal[selectedBodyTexture()!].get();
    }),
    flatTopBackTexture: createSignalObject<
      GuitarBodyTexture | null | undefined
    >(props?.flatTopBackTexture ? createBodyTexture(props?.flatTopBackTexture) : undefined),
    forearmCutTexture: createSignalObject<GuitarBodyTexture | null | undefined>(
      props?.forearmCutTexture ? createBodyTexture(props?.forearmCutTexture) : undefined
    ),
    tummyCutTexture: createSignalObject<GuitarBodyTexture | null | undefined>(
      props?.tummyCutTexture ? createBodyTexture(props?.tummyCutTexture) : undefined
    ),
    forearmTummyCutTexture: createSignalObject<
      GuitarBodyTexture | null | undefined
    >(props?.forearmTummyCutTexture ? createBodyTexture(props?.forearmTummyCutTexture) : undefined),
    carvedTopTexture: createSignalObject<GuitarBodyTexture | null | undefined>(
      props?.carvedTopTexture ? createBodyTexture(props?.carvedTopTexture) : undefined
    ),
    carvedTopBackTexture: createSignalObject<
      GuitarBodyTexture | null | undefined
    >(props?.carvedTopBackTexture ? createBodyTexture(props?.carvedTopBackTexture) : undefined),
    carvedTopTummyCutTexture: createSignalObject<
      GuitarBodyTexture | null | undefined
    >(props?.carvedTopTummyCutTexture ? createBodyTexture(props?.carvedTopTummyCutTexture) : undefined),
    spawnPoints: {
      selected: createSignalObject<GuitarBodySPEnum>(),
      hovered: createSignalObject<GuitarBodySPEnum>(),
      getSelectedSignal: () => {
        switch (signal.spawnPoints.selected.get()) {
          case GuitarBodySPEnum.fingerboard:
            return {
              get: signal.spawnPoints.fingerboard.position.get,
              set: signal.spawnPoints.fingerboard.position.set,
            };
          case GuitarBodySPEnum.bridge:
            return {
              get: signal.spawnPoints.bridge.position.get,
              set: signal.spawnPoints.bridge.position.set,
            };
          case GuitarBodySPEnum.switch:
            return {
              get: signal.spawnPoints.switch.position.get,
              set: signal.spawnPoints.switch.position.set,
            };
          case GuitarBodySPEnum.jackSide:
            return {
              get: signal.spawnPoints.jack.side.position.get,
              set: signal.spawnPoints.jack.side.position.set,
            };
          case GuitarBodySPEnum.jackTop:
            return {
              get: signal.spawnPoints.jack.top.position.get,
              set: signal.spawnPoints.jack.top.position.set,
            };
          case GuitarBodySPEnum.pickupBridge:
            return {
              get: signal.spawnPoints.pickup.bridge.position.get,
              set: signal.spawnPoints.pickup.bridge.position.set,
            };
          case GuitarBodySPEnum.pickupMiddle:
            return {
              get: signal.spawnPoints.pickup.middle.position.get,
              set: signal.spawnPoints.pickup.middle.position.set,
            };
          case GuitarBodySPEnum.pickupNeck:
            return {
              get: signal.spawnPoints.pickup.neck.position.get,
              set: signal.spawnPoints.pickup.neck.position.set,
            };
          case GuitarBodySPEnum.knobs:
            return {
              get: selectedKnobIndex.get()
                ? knobs()[selectedKnobIndex.get()!].get
                : () => undefined,
              set:
                selectedKnobIndex.get() !== undefined
                  ? knobs()[selectedKnobIndex.get()!].set
                  : (x) => {
                      console.log("wrong");
                    },
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
          props?.switchSpawnPoint?.rotation || 0
        ),
      },
      jack: {
        side: {
          ...createSpawnPoint(props?.sideJackSpawnPoint),
          rotation: createSignalObject<number>(
            props?.sideJackSpawnPoint?.rotation || 0
          ),
        },
        top: {
          ...createSpawnPoint(props?.topJackSpawnPoint),
          rotation: createSignalObject<number>(
            props?.topJackSpawnPoint?.rotation || 0
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
          signal.spawnPoints,
          R.pick(["bridge", "fingerboard", "switch"]),
          R.values,
          R.map((x) => x.position)
        ),
        ...R.pipe(
          signal.spawnPoints.pickup,
          R.pick(["neck", "middle", "bridge"]),
          R.values,
          R.map((x) => x.position)
        ),
        ...signal.spawnPoints.knobs.get(),
        ...R.pipe(
          signal.spawnPoints.jack,
          R.values,
          R.map((x) => x.position)
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
  };

  // createEffect(()=>{
  //   console.log(signal.getSelectedBodyTextureSignal()?.get());
  // })
  return signal;
}
