import { Accessor, For, JSX, Match, Show, Switch, createMemo } from "solid-js";
import ToggleableButtonWithState from "../../../../commons/components/toggleable-button-with-state";
import ImageInput from "../../../../commons/components/image-input";
import { Input } from "~/commons/components/input";
import { Textarea } from "~/commons/components/textarea";
import { Button } from "~/commons/components/button";
import {
  GuitarBodySPEnum,
  guitarBodyContourMediaKey,
} from "../utils/constant";
import { SpawnPointType } from "../utils/types";
import {
  EditorGui,
  EditorGuiGroup,
  EditorGuiSubMenu,
  keyboardMove,
} from "~/commons/components/editor-gui";
import { Constants } from "~/constants";
import { useElectricModel } from "../electric-model-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { Range } from "~/commons/components/range";
import { GuitarBody, GuitarModel } from "stranough-common";

export default function ModelEditorGui() {
  // let fileInput : HTMLInputElement | undefined;

  let model = createMemo(() => useElectricModel().get());

  const guitarModelBodyMediaButton = createMemo(() => {
    return guitarBodyContourMediaKey.map((key) => (
      <div>
        <ImageInput
          label={key.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
            return str.toUpperCase();
          })}
          imageFilename={
            model()
              ?.getSelectedBodySignal()
              ?.getSelectedContourSignal()
              ?.[key].get()?.filename
          }
          onLoad={(id) => {
            model()
              ?.getSelectedBodySignal()
              ?.getSelectedContourSignal()
              ?.[key].set(id);
          }}
          onRemove={() => {
            model()
              ?.getSelectedBodySignal()
              ?.getSelectedContourSignal()
              ?.[key].set(null);
          }}
          partType={"body"}
        />
      </div>
    ));
  });

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
      />
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Body</span>
      </EditorGuiGroup>
      <EditorGuiGroup>
        {GuitarModel.bodyKeys.map((key) => (
          <ToggleableButtonWithState
            isActive={!!model()?.[key].get()}
            onClick={() => model()?.selectedBody.set(key)}
            isFocus={model()?.selectedBody.get() === key}
            onReset={() => {
              model()?.[key].set();
              model()?.selectedBody.set();
            }}
          >
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </ToggleableButtonWithState>
        ))}
      </EditorGuiGroup>
      <Show when={!!model()?.selectedBody.get()}>
        <EditorGuiGroup parent>
          <span class="font-bold text-center mx-3">
            Textures
          </span>
        </EditorGuiGroup>
        <EditorGuiGroup>
          <ImageInput
            label={<span class="text-sm">Mask</span>}
            imageFilename={
              model()?.getSelectedBodySignal()?.mask.get()?.filename
            }
            onLoad={(id) => model()?.getSelectedBodySignal()?.mask.set(id)}
            onRemove={() => model()?.getSelectedBodySignal()?.mask.set(null)}
            partType={"body"}
          />
          <ImageInput
            label={<span class="text-sm">Back Mask</span>}
            imageFilename={
              model()?.getSelectedBodySignal()?.backMask.get()?.filename
            }
            onLoad={(id) => model()?.getSelectedBodySignal()?.backMask.set(id)}
            onRemove={() => model()?.getSelectedBodySignal()?.backMask.set(null)}
            partType={"body"}
          />
          <ImageInput
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
          />
          <Show when={model()?.getSelectedBodySignal()?.mask.get()}>
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
          </Show>
        </EditorGuiGroup>
        <EditorGuiGroup parent>
          <span class="font-bold text-center mx-3">Contour</span>
        </EditorGuiGroup>
        <EditorGuiGroup>
          {GuitarBody.contourKeys.map((key) => <>
            <ToggleableButtonWithState
            isFocus={
              model()?.getSelectedBodySignal()?.selectedTopContour.get() ===
                key ||
              model()?.getSelectedBodySignal()?.selectedBackContour.get() ===
                key
            }
            isActive={!!model()?.getSelectedBodySignal()?.[key].get()}
            onReset={() => {
              model()?.getSelectedBodySignal()?.[key].set();
              if (key.match(/top/)) {
                model()?.getSelectedBodySignal()?.selectedTopContour.set();
              } else {
                model()?.getSelectedBodySignal()?.selectedBackContour.set();
              }
            }}
            onClick={() => {
              if (key.match(/top/)) {
                model()
                  ?.getSelectedBodySignal()
                  ?.selectedTopContour.set(key as any);
              } else {
                model()
                  ?.getSelectedBodySignal()
                  ?.selectedBackContour.set(key as any);
              }
            }}
          >
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </ToggleableButtonWithState>
            <EditorGuiSubMenu
              isActive={
                model()?.getSelectedBodySignal()?.selectedContour() === key
              }
            >
              <Show
                when={
                  !!model()?.getSelectedBodySignal()?.getSelectedContourSignal()
                }
              >
                <EditorGuiGroup parent>
                  <span class="font-bold text-center mx-3">
                    {model()
                      ?.getSelectedBodySignal()
                      ?.selectedContour()
                      ?.replace(/([A-Z])/g, " $1")
                      .replace(/^./, function (str) {
                        return str.toUpperCase();
                      })}
                  </span>
                </EditorGuiGroup>
                <EditorGuiGroup>
                  {guitarModelBodyMediaButton()}
                  <span class="text-sm -mt-1">Price</span>
                  <Input
                    class="!bg-gray-800 !text-white-950"
                    value={model()?.getSelectedBodySignal()?.getSelectedContourSignal()?.price.get()}
                    onChange={(e) =>
                      model()?.getSelectedBodySignal()?.getSelectedContourSignal()?.price.set(parseInt(e.target.value ?? "0"))
                    }
                    type="number"
                    min={0}
                  />
                </EditorGuiGroup>
              </Show>
            </EditorGuiSubMenu>
            </>)}
        </EditorGuiGroup>
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
        name="Fingerboard"
        spEnum={GuitarBodySPEnum.fingerboard}
        spSignal={model()?.spawnPoints.fingerboard}
      />
      <Show when={model()?.selectedBody.get() === 'setInBody'}>
        <SPButton
          name="Fingerboard Back End"
          spEnum={GuitarBodySPEnum.fingerboardBackEnd}
          spSignal={model()?.spawnPoints.fingerboardBackEnd}
        />
      </Show>
      <SPButton
        name="Bridge"
        spEnum={GuitarBodySPEnum.bridge}
        spSignal={model()?.spawnPoints.bridge}
      />
      <SPButton
        name="Switch"
        spEnum={GuitarBodySPEnum.switch}
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
        <span class="text-sm ">Pickup</span>
        <SPButton
          name="Middle"
          spEnum={GuitarBodySPEnum.pickupMiddle}
          spSignal={model()?.spawnPoints.pickup.middle}
        />
        <SPButton
          name="Neck"
          spEnum={GuitarBodySPEnum.pickupNeck}
          spSignal={model()?.spawnPoints.pickup.neck}
        />
        <SPButton
          name="Bridge"
          spEnum={GuitarBodySPEnum.pickupBridge}
          spSignal={model()?.spawnPoints.pickup.bridge}
        />
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm ">Jack</span>
        <SPButton
          name="Side"
          spEnum={GuitarBodySPEnum.jackSide}
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
          spEnum={GuitarBodySPEnum.jackTop}
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
                      GuitarBodySPEnum.knobs &&
                    model()?.spawnPoints.knobs.selectedKnobIndex.get() === i()
                  }
                  onClick={() => {
                    !knob.get() && knob.set(Constants.defaultPos);
                    model()?.spawnPoints.selected.set(GuitarBodySPEnum.knobs);
                    model()?.spawnPoints.knobs.selectedKnobIndex.set(i());
                  }}
                  onHover={() => {
                    model()?.spawnPoints.hovered.set(GuitarBodySPEnum.knobs);
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
  spEnum: GuitarBodySPEnum;
}) {
  const model = createMemo(() => useElectricModel().get());
  const selectedSP = model()?.spawnPoints.selected;
  const hoveredSP = model()?.spawnPoints.hovered;
  return (
    <ToggleableButtonWithState
      isActive={!!props.spSignal?.position.get()}
      isFocus={selectedSP?.get() === props.spEnum}
      onReset={() => props.spSignal?.position.set()}
      onView={() => props.spSignal?.isShow.set((prev) => !prev)}
      viewActive={props.spSignal?.isShow.get()}
      onClick={() => {
        !props.spSignal?.position.get() &&
          props.spSignal?.position.set(Constants.defaultPos);
        selectedSP?.set(props.spEnum);
      }}
      onHover={() => {
        hoveredSP?.set(props.spEnum);
      }}
      onLeave={() => {
        hoveredSP?.set();
      }}
    >
      {props.name}
    </ToggleableButtonWithState>
  );
}
