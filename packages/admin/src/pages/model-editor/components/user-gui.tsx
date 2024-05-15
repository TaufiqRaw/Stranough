import { Texture } from "pixi.js";
import {
  Accessor,
  For,
  JSX,
  Match,
  Show,
  Switch,
  createMemo,
  onMount,
} from "solid-js";
import {
  useGuitarModelSignal,
} from "~/pages/model-editor/guitar-model.context";
import PartPointButton from "./part-point-button";
import ImageInput from "./image-input";
import { Input } from "~/commons/components/input";
import { Textarea } from "~/commons/components/textarea";
import { Button } from "~/commons/components/button";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { Constants } from "~/constants";
import { GuitarBodySPEnum, guitarBodyTextureKey, guitarBodyTextureMediaKey, guitarModelBodyKey } from "../utils/constant";
import { GuitarBody, SpawnPointType } from "../utils/types";
import { SignalObject } from "~/commons/interfaces/signal-object.interface";

const defaultPos = {
  x: 0,
  y: 0,
};

export default function UserGui() {
  // let fileInput : HTMLInputElement | undefined;

  let guitarModel = useGuitarModelSignal();

  const guitarModelBodyMediaButton = createMemo(()=>{
    return guitarBodyTextureMediaKey.map((key)=><div>
      <span class="mb-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })}</span>
      <ImageInput
        imageFilename={guitarModel.getSelectedBodySignal()?.getSelectedBodyTextureSignal()?.[key].get()?.filename}
        onLoad={(id) => {
          guitarModel.getSelectedBodySignal()?.getSelectedBodyTextureSignal()?.[key].set(id);
        }}
        onRemove={() => {
          guitarModel.getSelectedBodySignal()?.getSelectedBodyTextureSignal()?.[key].set(null);
        }}
        onError={(error) => console.log(error)}
        partType={"body"}
      />
    </div>
    )
  })

  return (
    <div class=" bg-gray-900 py-3 text-white-950 flex flex-col h-screen overflow-y-auto max-w-[15rem]">
      <span class="font-bold text-center mx-3 mb-3">Model</span>
      <Group>
        <div class="flex flex-col gap-1">
          <span class="text-sm -mt-1">Names</span>
          <Input
            class="!bg-gray-800 !text-white-950"
            placeholder="Model Name"
            value={guitarModel.name.get()}
            onChange={(e) => {
              guitarModel.name.set(e.target.value);
            }}
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm -mt-1">Description</span>
          <Textarea
            class="!bg-gray-800 !text-white-950"
            placeholder="Description"
            value={guitarModel.description.get()}
            onChange={(e) => guitarModel.description.set(e.target.value)}
          />
        </div>
      </Group>
      <Group parent>
        <span class="font-bold text-center mx-3">Body</span>
      </Group>
      <Group>
          {guitarModelBodyKey.map((key) => 
            <PartPointButton
              name={key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })}
              isActive={!!guitarModel[key].get()}
              onClick={() => guitarModel.selectedBody.set(key)}
              isFocus={guitarModel.selectedBody.get() === key}
              onReset={()=>{guitarModel[key].set(); guitarModel.selectedBody.set()}}
            />)
          }
      </Group>
      <Show when={!!guitarModel.selectedBody.get()}>
        <Group parent>
          <span class="font-bold text-center mx-3">Textures</span>
        </Group>
        <Group>
            {guitarBodyTextureKey.map((key) => 
              <PartPointButton
                name={key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })}
                isActive={!!guitarModel.getSelectedBodySignal()?.[key].get()}
                onClick={() => guitarModel.getSelectedBodySignal()?.selectedBodyTexture.set(key)}
                isFocus={guitarModel.getSelectedBodySignal()?.selectedBodyTexture.get() === key}
                onReset={()=>{guitarModel.getSelectedBodySignal()?.[key].set(null); guitarModel.getSelectedBodySignal()?.selectedBodyTexture.set()}}
              />)}
        </Group>
        <Show when={!!guitarModel.getSelectedBodySignal()?.selectedBodyTexture.get()}>
          <Group parent>
            <span class="font-bold text-center mx-3">{
              guitarModel.getSelectedBodySignal()?.selectedBodyTexture.get()?.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
            }</span>
          </Group>
          <Group>
            {guitarModelBodyMediaButton()}
            <span>Scale</span>
            <input type="range" 
              value={guitarModel.getSelectedBodySignal()?.getSelectedBodyTextureSignal()?.scale.get()}
              oninput={(e)=>guitarModel.getSelectedBodySignal()?.getSelectedBodyTextureSignal()?.scale.set(parseFloat(e.target.value))}
              step={0.01}
              min={0.25}
              max={2}
            />
          </Group>
        </Show>
        <Group parent>
          <span class="font-bold text-center mx-3">Spawnpoints</span>
        </Group>
        <Switch>
          <Match when={guitarModel.selectedBody.get() === "boltOnBody"}>
            <Show when={!!guitarModel["boltOnBody"].get()}>
              <BodyGuiSection
                body={guitarModel.boltOnBody.get as Accessor<GuitarBody>}
              />
            </Show>
          </Match>
          <Match when={guitarModel.selectedBody.get() === "neckThroughBody"}>
            <Show when={!!guitarModel["neckThroughBody"].get()}>
              <BodyGuiSection
                body={
                  guitarModel.neckThroughBody.get as Accessor<GuitarBody>
                }
              />
            </Show>
          </Match>
          <Match when={guitarModel.selectedBody.get() === "setInBody"}>
            <Show when={!!guitarModel["setInBody"].get()}>
              <BodyGuiSection
                body={guitarModel.setInBody.get as Accessor<GuitarBody>}
              />
            </Show>
          </Match>
        </Switch>
      </Show>
      <Button
        class="mx-3 mt-5"
        onClick={guitarModel.save}
      >
        Save
      </Button>
    </div>
  );
}

function BodyGuiSection(props: { body: Accessor<GuitarBody> }) {
  return (
    <Group>
      <BodyPartPointButton
        bodySignal={props.body}
        name="Fingerboard"
        spEnum={GuitarBodySPEnum.fingerboard}
        spSignal={props.body().spawnPoints.fingerboard}
      />
      <BodyPartPointButton
        bodySignal={props.body}
        name="Bridge"
        spEnum={GuitarBodySPEnum.bridge}
        spSignal={props.body().spawnPoints.bridge}
      />
      <BodyPartPointButton
        bodySignal={props.body}
        name="Switch"
        spEnum={GuitarBodySPEnum.switch}
        spSignal={props.body().spawnPoints.switch}
      />
      <div class="flex flex-col gap-2">
        <span class="text-sm ">Pickup</span>
        <BodyPartPointButton
          bodySignal={props.body}
          name="Middle"
          spEnum={GuitarBodySPEnum.pickupMiddle}
          spSignal={props.body().spawnPoints.pickup.middle}
        />
        <BodyPartPointButton
          bodySignal={props.body}
          name="Neck"
          spEnum={GuitarBodySPEnum.pickupNeck}
          spSignal={props.body().spawnPoints.pickup.neck}
        />
        <BodyPartPointButton
          bodySignal={props.body}
          name="Bridge"
          spEnum={GuitarBodySPEnum.pickupBridge}
          spSignal={props.body().spawnPoints.pickup.bridge}
        />
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm ">Knobs</span>
        <Button onClick={(e) => props.body().spawnPoints.knobs.addKnobs()}>
          <span>Add</span>
        </Button>
        <For each={props.body().spawnPoints.knobs.get()}>
          {(knob, i) => (
            <div class="flex gap-2">
              <div class="flex-grow h-full">
                <PartPointButton
                  isActive={!!knob.get()}
                  isFocus={
                    props.body().spawnPoints.selected.get() ===
                      GuitarBodySPEnum.knobs &&
                    props.body().spawnPoints.knobs.selectedKnobIndex.get() ===
                      i()
                  }
                  onClick={() => {
                    !knob.get() && knob.set(defaultPos);
                    props
                      .body()
                      .spawnPoints.selected.set(GuitarBodySPEnum.knobs);
                    props.body().spawnPoints.knobs.selectedKnobIndex.set(i());
                  }}
                  onHover={() => {
                    props
                      .body()
                      .spawnPoints.hovered.set(GuitarBodySPEnum.knobs);
                  }}
                  onLeave={() => {
                    props.body().spawnPoints.hovered.set();
                  }}
                  name={"Knob " + (i() + 1)}
                />
              </div>
              <Button
                class="!py-0 !px-2"
                onClick={(e) => props.body().spawnPoints.knobs.removeKnobs(i())}
              >
                <span>Remove</span>
              </Button>
            </div>
          )}
        </For>
      </div>
    </Group>
  );
}

function BodyPartPointButton(props: {
  name: string;
  bodySignal: Accessor<GuitarBody>;
  spSignal: SpawnPointType;
  spEnum: GuitarBodySPEnum;
}) {
  const selectedSP = props.bodySignal().spawnPoints.selected;
  const hoveredSP = props.bodySignal().spawnPoints.hovered;
  return (
    <PartPointButton
      isActive={!!props.spSignal.position.get()}
      isFocus={selectedSP.get() === props.spEnum}
      onReset={() => props.spSignal.position.set()}
      onView={() => props.spSignal.isShow.set((prev)=>!prev)}
      viewActive={props.spSignal.isShow.get()}
      onClick={() => {
        !props.spSignal.position.get() && props.spSignal.position.set(defaultPos);
        selectedSP.set(props.spEnum);
      }}
      onHover={() => {
        hoveredSP.set(props.spEnum);
      }}
      onLeave={() => {
        hoveredSP.set();
      }}
      name={props.name}
    />
  );
}

function Group(props: { children: JSX.Element; parent?: boolean }) {
  return (
    <div
      class={
        "px-3 flex flex-col gap-2 border-t-gray-500 border-t py-3 last:border-b-gray-500 last:border-b " +
        (props.parent ? "" : "bg-gray-800")
      }
    >
      {props.children}
    </div>
  );
}
