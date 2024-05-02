import { Texture } from "pixi.js";
import { createMemo, onMount } from "solid-js";
import {
  GuitarBodySPEnum,
  SpawnPointType,
  useGuitarBodyState,
} from "~/contexts/GuitarConfigContext";
import PartPointButton from "./PartPointButton";
import ImageInput from "./ImageInput";

const defaultPos = {
  x: 0,
  y: 0,
};

export default function UserGui() {
  // let fileInput : HTMLInputElement | undefined;

  let guitarBodyState = useGuitarBodyState();

  const createPartPointButton = (
    name: string,
    spSignal: SpawnPointType,
    spEnum: GuitarBodySPEnum
  ) => {
    const selectedSP = guitarBodyState.spawnPoints.selected;
    const hoveredSP = guitarBodyState.spawnPoints.hovered;
    return (
      <PartPointButton
        isActive={!!spSignal.get()}
        isFocus={selectedSP.get() === spEnum}
        onClick={() => {
          !spSignal.get() && spSignal.set(defaultPos);
          selectedSP.set(spEnum);
        }}
        onHover={() => {
          hoveredSP.set(spEnum);
        }}
        onLeave={() => {
          hoveredSP.set();
        }}
        name={name}
      />
    );
  };

  const fingerboardButton = createMemo(() =>
    createPartPointButton(
      "Fingerboard",
      guitarBodyState.spawnPoints.fingerboard,
      GuitarBodySPEnum.fingerboard
    )
  );

  const bridgeButton = createMemo(() =>
    createPartPointButton(
      "Bridge",
      guitarBodyState.spawnPoints.bridge,
      GuitarBodySPEnum.bridge
    )
  );

  return (
    <div class=" bg-util py-3 text-white-950 flex flex-col gap-3 h-screen">
      <span class="font-medium mx-3">Body</span>
      <hr class="border-t-gray-500" />
      <div class="flex flex-col gap-2 mx-3">
        <span class="font-medium">Shadow</span>
        <ImageInput
          onLoad={(img) => {
            guitarBodyState.shadow.set(Texture.from(img));
          }}
          onError={() => {
            console.log("error");
          }}
          onRemove={() => {
            guitarBodyState.shadow.set();
          }}
        />
      </div>
      <hr class="border-t-gray-500" />
      <div class="flex flex-col gap-2 mx-3">
        <span class="font-medium">Part Points</span>
        {fingerboardButton()}
        {bridgeButton()}
      </div>

      {/* <input ref={fileInput} type="file" accept="image/png"  /> */}
    </div>
  );
}
