import { Accessor, For, JSX, Match, Show, Switch, createMemo } from "solid-js";
import ToggleableButtonWithState from "../../../commons/components/toggleable-button-with-state";
import ImageInput from "../../../commons/components/image-input";
import { Input } from "~/commons/components/input";
import { Textarea } from "~/commons/components/textarea";
import { Button } from "~/commons/components/button";
import {
  GuitarBodySPEnum,
  guitarBodyTextureKey,
  guitarBodyTextureMediaKey,
  guitarModelBodyKey,
} from "../utils/constant";
import {
  GuitarBody,
  GuitarModel,
  SpawnPointType,
} from "../utils/types";
import {
  EditorGui,
  EditorGuiGroup,
  EditorGuiSubMenu,
} from "~/commons/components/editor-gui";
import { Constants } from "~/constants";
import { useGuitarModel } from "../model-editor.page";
import { Checkbox } from "~/commons/components/checkbox";

export default function ModelEditorGui() {
  // let fileInput : HTMLInputElement | undefined;

  let model = createMemo(()=>useGuitarModel().get());

  const guitarModelBodyMediaButton = createMemo(() => {
    return guitarBodyTextureMediaKey.map((key) => (
      <div>
        <span class="mb-1">
          {key.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
            return str.toUpperCase();
          })}
        </span>
        <ImageInput
          imageFilename={
            model()
              ?.getSelectedBodySignal()
              ?.getSelectedBodyTextureSignal()
              ?.[key].get()?.filename
          }
          onLoad={(id) => {
            model()
              ?.getSelectedBodySignal()
              ?.getSelectedBodyTextureSignal()
              ?.[key].set(id);
          }}
          onRemove={() => {
            model()
              ?.getSelectedBodySignal()
              ?.getSelectedBodyTextureSignal()
              ?.[key].set(null);
          }}
          onError={(error) => console.log(error)}
          partType={"body"}
        />
      </div>
    ));
  });

  return (
    <EditorGui>
      <span class="font-bold text-center mx-3 mb-3">Model</span>
      <EditorGuiGroup>
        <div class="flex flex-col gap-1">
          <span class="text-sm -mt-1">Names</span>
          <Input
            class="!bg-gray-800 !text-white-950"
            placeholder="Model Name"
            value={model()?.name.get()}
            onChange={(e) => {
              model()?.name.set(e.target.value);
            }}
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm -mt-1">Description</span>
          <Textarea
            class="!bg-gray-800 !text-white-950"
            placeholder="Description"
            value={model()?.description.get()}
            onChange={(e) => model()?.description.set(e.target.value)}
          />
        </div>
        <Checkbox checked={model()?.allowSingleCoilPickup.get} label={
          <span class="text-sm">Allow Single Coil Pickup</span>
        } onChange={model()?.allowSingleCoilPickup.set}/>
      </EditorGuiGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Body</span>
      </EditorGuiGroup>
      <EditorGuiGroup>
        {guitarModelBodyKey.map((key) => (
          <ToggleableButtonWithState
            isActive={!!model()?.[key].get()}
            onClick={() => model()?.selectedBody.set(key)}
            isFocus={model()?.selectedBody.get() === key}
            onReset={() => {
              model()?.[key].set();
              model()?.selectedBody.set();
            }}
          >
            {key.replace(/([A-Z])/g, " $1").replace(/^./, str=>str.toUpperCase())}
          </ToggleableButtonWithState>
        ))}
      </EditorGuiGroup>
      <Show when={!!model()?.selectedBody.get()}>
        <EditorGuiGroup parent>
          <span class="font-bold text-center mx-3">Default Mask</span>
        </EditorGuiGroup>
        <EditorGuiGroup>
          <ImageInput
            imageFilename={model()?.getSelectedBodySignal()?.mask?.get()?.filename}
            onLoad={(id) => model()?.getSelectedBodySignal()?.mask?.set(id)}
            onRemove={() => model()?.getSelectedBodySignal()?.mask?.set(null)}
            onError={(error) => console.log(error)}
            partType={"body"}
          />
          <span>Scale</span>
          <input
            type="range"
            value={model()?.getSelectedBodySignal()?.maskScale.get()}
            oninput={(e) =>
              model()?.getSelectedBodySignal()?.maskScale.set(parseFloat(e.target.value))
            }
            step={0.01}
            min={0.25}
            max={2}
          />
        </EditorGuiGroup>
        <EditorGuiGroup parent>
          <span class="font-bold text-center mx-3">Textures</span>
        </EditorGuiGroup>
        <EditorGuiGroup>
          {guitarBodyTextureKey.map((key) => (
            <EditorGuiSubMenu
              isActive={
                model()
                  ?.getSelectedBodySignal()
                  ?.selectedBodyTexture.get() === key
              }
              isExist={
                !!model()
                  ?.getSelectedBodySignal()
                  ?.[key].get()
              }
              onReset={() =>{
                model()
                  ?.getSelectedBodySignal()
                  ?.[key].set();
                model()
                  ?.getSelectedBodySignal()
                  ?.selectedBodyTexture.set();
              }}
              title={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
              onClick={()=> model()?.getSelectedBodySignal()?.selectedBodyTexture.set(key)}
            >
              <Show
                when={
                  !!model()
                    ?.getSelectedBodySignal()
                    ?.selectedBodyTexture.get()
                }
              >
                <EditorGuiGroup parent>
                  <span class="font-bold text-center mx-3">
                    {model()
                      ?.getSelectedBodySignal()
                      ?.selectedBodyTexture.get()
                      ?.replace(/([A-Z])/g, " $1")
                      .replace(/^./, function (str) {
                        return str.toUpperCase();
                      })}
                  </span>
                </EditorGuiGroup>
                <EditorGuiGroup>
                  {guitarModelBodyMediaButton()}
                  <span>Scale</span>
                  <input
                    type="range"
                    value={model()
                      ?.getSelectedBodySignal()
                      ?.getSelectedBodyTextureSignal()
                      ?.scale.get()}
                    oninput={(e) =>
                      model()
                        ?.getSelectedBodySignal()
                        ?.getSelectedBodyTextureSignal()
                        ?.scale.set(parseFloat(e.target.value))
                    }
                    step={0.01}
                    min={0.25}
                    max={2}
                  />
                </EditorGuiGroup>
              </Show>
            </EditorGuiSubMenu>
          ))}
        </EditorGuiGroup>
        <Show when={model()?.getSelectedBodySignal()?.selectedBodyTexture.get()}>
          <EditorGuiGroup parent>
            <span class="font-bold text-center mx-3">Spawnpoints</span>
          </EditorGuiGroup>
          <ModelSPGuiSection />
        </Show>
      </Show>
      <Button class="mx-3 mt-5" onClick={model()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}

function ModelSPGuiSection() {
  const model = createMemo(()=>useGuitarModel().get())
  return (
    <EditorGuiGroup>
      <SPButton
        name="Fingerboard"
        spEnum={GuitarBodySPEnum.fingerboard}
        spSignal={model()?.spawnPoints.fingerboard}
      />
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
          <Input
            type="range"
            value={model()?.spawnPoints.jack.side.rotation.get()}
            oninput={(e) =>
              model()?.spawnPoints.jack.side.rotation.set(parseFloat(e.target.value))
            }
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
          <Input
            type="range"
            value={model()?.spawnPoints.jack.top.rotation.get()}
            oninput={(e) =>
              model()?.spawnPoints.jack.top.rotation.set(parseFloat(e.target.value))
            }
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
                    model()?.spawnPoints.knobs.selectedKnobIndex.get() ===
                      i()
                  }
                  onClick={() => {
                    !knob.get() && knob.set(Constants.defaultPos);
                    model()
                      ?.spawnPoints.selected.set(GuitarBodySPEnum.knobs);
                    model()?.spawnPoints.knobs.selectedKnobIndex.set(i());
                  }}
                  onHover={() => {
                    model()
                      ?.spawnPoints.hovered.set(GuitarBodySPEnum.knobs);
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
  const model = createMemo(()=>useGuitarModel().get())
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
