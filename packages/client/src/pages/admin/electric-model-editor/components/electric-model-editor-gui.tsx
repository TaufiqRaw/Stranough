import { Accessor, For, JSX, Match, Show, Switch, createEffect, createMemo, createSignal } from "solid-js";
import ToggleableButtonWithState from "../../../../commons/components/toggleable-button-with-state";
import ImageInput from "../../../../commons/components/image-input";
import { Input } from "~/commons/components/input";
import { Textarea } from "~/commons/components/textarea";
import { Button } from "~/commons/components/button";
import { SelectableElectricModelComponents, SpawnPointType } from "../utils/types";
import {
  EditorGui,
  EditorGuiGroup,
  keyboardMove,
} from "~/commons/components/editor-gui";
import { Constants } from "~/constants";
import { useElectricModel } from "../electric-model-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { Range } from "~/commons/components/range";
import { ElectricModel as ElectricModelConfig } from "stranough-common";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import * as R from "remeda";
import { on } from "solid-js";

export default function ElectricModelEditorGui() {
  // let fileInput : HTMLInputElement | undefined;

  let model = createMemo(() => useElectricModel().get());

  const [selectedContour, setSelectedContour] = createSignal<
    typeof ElectricModelConfig.contourKeys[number]
  >();

  createEffect(on(selectedContour, v=>{
    if(v === 'tummyContour'){
      model()?.selectedBackContour.set(v);
    }else if(v === 'forearmContour'){
      model()?.selectedTopContour.set(v);
    }else {
      model()?.selectedBackContour.set(v);
      model()?.selectedTopContour.set(v);
    }
  }))

  return (
    <EditorGui
      onKeydown={(key, t) => {
        switch (key) {
          case "ArrowUp":
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight": {
            keyboardMove(key, t, (speed) =>
              model()
                ?.spawnPoints.getSelectedSignal()
                ?.set((prev) => ({
                  x: (prev?.x ?? 0) + speed.x,
                  y: (prev?.y ?? 0) + speed.y,
                }))
            );
            break;
          }
          case "x": {
            model()
              ?.spawnPoints.getSelectedSignal()
              ?.set((prev) => ({ x: 0, y: prev?.y ?? 0 }));
            break;
          }
          case "Escape": {
            model()?.spawnPoints.selected.set();
            break;
          }
        }
      }}
    >
      <span class="font-bold text-center mx-3 mb-3">Model</span>
      <NameDescriptionGroup
        name={model()?.name}
        description={model()?.description}
        placeholder={model()?.placeholder}
        price={model()?.price}
        thumbnail={model()?.thumbnail}
      >
        <Checkbox
          label="Is Bass"
          checked={model()?.isBass.get}
          onChange={(e) => model()?.isBass.set(e)}
        />
      </NameDescriptionGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Body</span>
      </EditorGuiGroup>
      <EditorGuiGroup>
        {ElectricModelConfig.constructionKeys.map((key) => (
          <ToggleableButton
            isActive={model()?.selectedConstruction.get() === key}
            onClick={() => model()?.selectedConstruction.set(key)}
          >
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </ToggleableButton>
        ))}
        <span>Scale</span>
        <Range
          value={model()?.maskScale.get()}
          onChange={(e) =>
            model()?.maskScale.set(e)
          }
          step={0.01}
          min={0.25}
          max={2}
        />
        <span>Soundhole Scale</span>
        <Range
          value={model()?.soundHoleScale.get()}
          onChange={(e) =>
            model()?.soundHoleScale.set(e)
          }
          step={0.01}
          min={0.25}
          max={2}
        />
      </EditorGuiGroup>
      <Show when={!!model()?.selectedConstruction.get()}>
        <EditorGuiGroup parent>
          <span class="font-bold text-center mx-3">
            Construction Configuration
          </span>
        </EditorGuiGroup>
        <EditorGuiGroup>

          <ImageInput
            label={<span class="text-sm">Mask</span>}
            imageFilename={
              model()?.mask.get()?.filename
            }
            acceptedTypes="image/svg+xml"
            onLoad={(id) => model()?.mask.set(id)}
            onRemove={() => model()?.mask.set(null)}
            partType={"body"}
          />
          {/* <ImageInput
            label={<span class="text-sm">Burst Top</span>}
            imageFilename={
              model()?.getSelectedBodySignal()?.burstTop.get()?.filename
            }
            onLoad={(id) => model()?.getSelectedBodySignal()?.burstTop.set(id)}
            onRemove={() =>
              model()?.getSelectedBodySignal()?.burstTop.set(null)
            }
            partType={"body"}
          />
          <ImageInput
            label={<span class="text-sm">Burst Back</span>}
            imageFilename={
              model()?.getSelectedBodySignal()?.burstBack.get()?.filename
            }
            onLoad={(id) => model()?.getSelectedBodySignal()?.burstBack.set(id)}
            onRemove={() =>
              model()?.getSelectedBodySignal()?.burstBack.set(null)
            }
            partType={"body"}
          /> */}
        </EditorGuiGroup>
        <EditorGuiGroup parent>
          <span class="font-bold text-center mx-3">Contour</span>
        </EditorGuiGroup>
        <EditorGuiGroup>
          {ElectricModelConfig.contourKeys.map((key) =>
          <ToggleableButton
            isActive={selectedContour() === key}
            onClick={() => setSelectedContour(key)}
          >
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </ToggleableButton>)}
        </EditorGuiGroup>
        <Show when={selectedContour()}>
          <EditorGuiGroup parent>
            <span class="font-bold text-center mx-3">Contour Configuration</span>
          </EditorGuiGroup>
          <EditorGuiGroup>
            <ImageInput
              label={<span class="text-sm">Overlay Mask</span>}
              imageFilename={
                model()?.[`${selectedContour()!}Overlay`].get()?.filename
              }
              acceptedTypes="image/png"
              onLoad={(img) => model()?.[`${selectedContour()!}Overlay`].set(img)}
              onRemove={() => model()?.[`${selectedContour()!}Overlay`].set(null)}
              partType={"body"}
            />
          </EditorGuiGroup>
        </Show>
        <EditorGuiGroup parent>
          <span class="font-bold text-center mx-3">Spawnpoints</span>
        </EditorGuiGroup>
        <ModelSPGuiSection />
      </Show>
      <Button class="mx-3 mt-5" onClick={model()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}

function ModelSPGuiSection() {
  const model = createMemo(() => useElectricModel().get());
  return (
    <EditorGuiGroup>
      <SPButton
        name="Bridge"
        component={"bridge"}
        spSignal={model()?.spawnPoints.bridge}
      />
      <SPButton
        name="Top End"
        component={"topEnd"}
        spSignal={model()?.spawnPoints.top}
      />
      <SPButton
        name="Bottom End"
        component={"bottomEnd"}
        spSignal={model()?.spawnPoints.bottom}
      />
      <SPButton
        name="Sound Hole Left"
        component={"soundHoleLeft"}
        spSignal={model()?.spawnPoints.soundHoleLeft}
      />
      <Show when={model()?.spawnPoints.soundHoleLeft.position.get()}>
        <Range
          value={model()?.spawnPoints.soundHoleLeft.rotation.get()}
          onChange={(e) => model()?.spawnPoints.soundHoleLeft.rotation.set(e)}
          step={0.01}
          min={-Math.PI}
          max={Math.PI}
        />
      </Show>

      <ToggleableButton
        isActive={model()?.mirrorSoundHole.get() ?? false}
        onClick={() => model()?.mirrorSoundHole.set((prev) => !prev)}
      > Mirror Sound Hole </ToggleableButton>

      <Show when={!model()?.mirrorSoundHole.get()}>
        <SPButton
          name="Sound Hole Right"
          component={"soundHoleRight"}
          spSignal={model()?.spawnPoints.soundHoleRight}
        />
        <Show when={model()?.spawnPoints.soundHoleRight.position.get()}>
          <Range
            value={model()?.spawnPoints.soundHoleRight.rotation.get()}
            onChange={(e) => model()?.spawnPoints.soundHoleRight.rotation.set(e)}
            step={0.01}
            min={-Math.PI}
            max={Math.PI}
          />
        </Show>
      </Show>

      <SPButton
        name="Electronic Cover"
        component={"electronicCover"}
        spSignal={model()?.spawnPoints.electronicCover}
      />
      <Show when={model()?.spawnPoints.electronicCover.position.get()}>
        <Range
          value={model()?.spawnPoints.electronicCover.rotation.get()}
          onChange={(e) => model()?.spawnPoints.electronicCover.rotation.set(e)}
          step={0.01}
          min={-Math.PI}
          max={Math.PI}
        />
      </Show>
      
      <SPButton
        name="Minor Electronic Cover"
        component={"minorElectronicCover"}
        spSignal={model()?.spawnPoints.minorElectronicCover}
      />
      <Show when={model()?.spawnPoints.minorElectronicCover.position.get()}>
        <Range
          value={model()?.spawnPoints.minorElectronicCover.rotation.get()}
          onChange={(e) => model()?.spawnPoints.minorElectronicCover.rotation.set(e)}
          step={0.01}
          min={-Math.PI}
          max={Math.PI}
        />
      </Show>

      <SPButton
        name="Battery Cover"
        component={"batteryCover"}
        spSignal={model()?.spawnPoints.batteryCover}
      />
      <Show when={model()?.spawnPoints.batteryCover.position.get()}>
        <Range
          value={model()?.spawnPoints.batteryCover.rotation.get()}
          onChange={(e) => model()?.spawnPoints.batteryCover.rotation.set(e)}
          step={0.01}
          min={-Math.PI}
          max={Math.PI}
        />
      </Show>

      <SPButton
        name="Logo"
        component={"logo"}
        spSignal={model()?.spawnPoints.logo}
      />
      <Show when={model()?.spawnPoints.logo.position.get()}>
        <Range
          value={model()?.spawnPoints.logo.rotation.get()}
          onChange={(e) => model()?.spawnPoints.logo.rotation.set(e)}
          step={0.01}
          min={-Math.PI}
          max={Math.PI}
        />
      </Show>

      <SPButton
        name="Switch"
        component={"switch"}
        spSignal={model()?.spawnPoints.switch}
      />
      <Show when={model()?.spawnPoints.switch.position.get()}>
        <Range
          value={model()?.spawnPoints.switch.rotation.get()}
          onChange={(e) => model()?.spawnPoints.switch.rotation.set(e)}
          step={0.01}
          min={-Math.PI}
          max={Math.PI}
        />
      </Show>
      <div class="flex flex-col gap-2">
        <span class="text-sm ">Jack</span>
        <SPButton
          name="Side"
          component={"jackSide"}
          spSignal={model()?.spawnPoints.jack.side}
        />
        <Show when={model()?.spawnPoints.jack.side.position.get()}>
          <Range
            value={model()?.spawnPoints.jack.side.rotation.get()}
            onChange={(e) => model()?.spawnPoints.jack.side.rotation.set(e)}
            step={0.01}
            min={-Math.PI}
            max={Math.PI}
          />
        </Show>
        <SPButton
          name="Top"
          component={"jackTop"}
          spSignal={model()?.spawnPoints.jack.top}
        />
        <Show when={model()?.spawnPoints.jack.top.position.get()}>
          <Range
            value={model()?.spawnPoints.jack.top.rotation.get()}
            onChange={(e) => model()?.spawnPoints.jack.top.rotation.set(e)}
            step={0.01}
            min={-Math.PI}
            max={Math.PI}
          />
        </Show>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm ">Knobs</span>
        <Button onClick={(e) => model()?.spawnPoints.knobs.addKnobs()}>
          <span>Add</span>
        </Button>
        <For each={model()?.spawnPoints.knobs.get()}>
          {(knob, i) => (
            <div class="flex gap-2">
              <div class="flex-grow h-full">
                <ToggleableButtonWithState
                  isActive={!!knob.get()}
                  isFocus={
                    model()?.spawnPoints.selected.get() ===
                      "knobs" &&
                    model()?.spawnPoints.knobs.selectedKnobIndex.get() === i()
                  }
                  onClick={() => {
                    !knob.get() && knob.set(Constants.defaultPos);
                    model()?.spawnPoints.selected.set("knobs");
                    model()?.spawnPoints.knobs.selectedKnobIndex.set(i());
                  }}
                  onHover={() => {
                    model()?.spawnPoints.hovered.set("knobs");
                  }}
                  onLeave={() => {
                    model()?.spawnPoints.hovered.set();
                  }}
                >
                  {"Knob " + (i() + 1)}
                </ToggleableButtonWithState>
              </div>
              <Button
                class="!py-0 !px-2"
                onClick={(e) => model()?.spawnPoints.knobs.removeKnobs(i())}
              >
                <span>Remove</span>
              </Button>
            </div>
          )}
        </For>
      </div>
    </EditorGuiGroup>
  );
}

function SPButton(props: {
  name: string;
  spSignal: SpawnPointType | undefined;
  component: SelectableElectricModelComponents;
}) {
  const model = createMemo(() => useElectricModel().get());
  const selectedSP = model()?.spawnPoints.selected;
  const hoveredSP = model()?.spawnPoints.hovered;
  return (
    <ToggleableButtonWithState
      isActive={!!props.spSignal?.position.get()}
      isFocus={selectedSP?.get() === props.component}
      onReset={() => props.spSignal?.position.set()}
      onView={() => props.spSignal?.isShow.set((prev) => !prev)}
      viewActive={props.spSignal?.isShow.get()}
      onClick={() => {
        !props.spSignal?.position.get() &&
          props.spSignal?.position.set(Constants.defaultPos);
        selectedSP?.set(props.component);
      }}
      onHover={() => {
        hoveredSP?.set(props.component);
      }}
      onLeave={() => {
        hoveredSP?.set();
      }}
    >
      {props.name}
    </ToggleableButtonWithState>
  );
}
