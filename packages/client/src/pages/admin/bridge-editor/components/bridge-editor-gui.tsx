import { For, Show, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup, keyboardMove } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Input } from "~/commons/components/input";
import ToggleableButtonWithState from "~/commons/components/toggleable-button-with-state";
import * as R from "remeda";
import { Constants } from "~/constants";
import { Button } from "~/commons/components/button";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useGuitarBridge } from "../bridge-editor.page";
import { ElectricModelPreviewExplorer } from "~/commons/components/electric-model-preview-explorer";
import { Checkbox } from "~/commons/components/checkbox";
import { Option, Select } from "~/commons/components/select";
import { Pickup as PickupConfig, Bridge as BridgeConfig} from "stranough-common";


export function BridgeEditorGui() {
  const bridge = createMemo(() => useGuitarBridge().get());

  return (
    <EditorGui onKeydown={(key, t)=>{
      switch(key){
        case 'ArrowUp' :
        case 'ArrowDown' :
        case 'ArrowLeft' :
        case 'ArrowRight' : {
          keyboardMove(key, t, (speed) => bridge()?.getSelectedItem()?.set((prev) => ({
            x: ((prev?.x ?? 0) + speed.x),
            y: ((prev?.y ?? 0) + speed.y),
          })));
          break;
        }
        case 'x' : {
          bridge()?.getSelectedItem()?.set((prev)=>({x : 0, y : prev?.y ?? 0}));
          break;
        }
        case 'Escape' : {
          bridge()?.selectedItem.set();
          break;
        }
      }
    }}>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Bridge</span>
      </EditorGuiGroup>
      <ElectricModelPreviewExplorer />
      <NameDescriptionGroup
        description={bridge()?.description}
        name={bridge()?.name}
        placeholder={bridge()?.placeholder}
        price={bridge()?.price}
        thumbnail={bridge()?.thumbnail}
      >
        <Checkbox
          checked={bridge()?.isBass.get}
          label="Is For Bass?"
          onChange={bridge()?.isBass.set}
        />
        <Checkbox
          checked={bridge()?.extendable.get}
          label="Allow Overflow?"
          onChange={bridge()?.extendable.set}
        />
        <Checkbox
          checked={bridge()?.isTremolo.get}
          label="Have Tremolo?"
          onChange={bridge()?.isTremolo.set}
        />
        <span class="mt-1">
          Type
        </span>
        <Select
          value={bridge()?.type.get()}
          onChange={(value) => bridge()?.type.set(value as `${BridgeConfig.BridgeType}`)}
        >
          <For each={Object.values(BridgeConfig.BridgeType)}>
            {(type) => <Option value={type}>{type}</Option>}
          </For>
        </Select>
        <span class="mt-1">
          Supported Pickup
        </span>
        <Select
          value={bridge()?.supportedPickup.get()}
          onChange={(value) =>{ 
            if(value === 'none') return bridge()?.supportedPickup.set(undefined);
            bridge()?.supportedPickup.set(value as `${PickupConfig.PickupType}`)
          }}
        >
          <Option value={'none'}>No Pickup</Option>
          <For each={Object.values(PickupConfig.PickupType)}>
            {(type) => <Option value={type}>{type}</Option>}
          </For>
        </Select>
      </NameDescriptionGroup>
      <EditorGuiGroup>
        <ImageInput
          label="Texture"
          partType="bridge"
          onError={(e) => console.error(e)}
          onLoad={(image) => {
            bridge()?.texture.set(image);
          }}
          onRemove={() => {
            bridge()?.texture.set(undefined);
          }}
          imageFilename={bridge()?.texture.get()?.filename}
        />
        <span>Scale</span>
        <input
          type="range"
          value={bridge()?.scale.get()}
          oninput={(e) => bridge()?.scale.set(parseFloat(e.target.value))}
          step={0.01}
          min={0.1}
          max={2}
        />
      </EditorGuiGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Points</span>
      </EditorGuiGroup>
      <EditorGuiGroup>
        <ToggleableButton
          isActive={bridge()?.selectedItem?.get() === "pivot"}
          onClick={() => bridge()?.selectedItem?.set("pivot")}
        >
          Pivot Point
        </ToggleableButton>
        <ToggleableButton
          isActive={bridge()?.selectedItem?.get() === "bottomPoint"}
          onClick={() => bridge()?.selectedItem?.set("bottomPoint")}
        >
          Bottom Point
        </ToggleableButton>
        <Show when={bridge()?.type.get() !== 'mono'}>
          <span class="text-sm -mt-1">String Points</span>
          <Input
            class="!bg-gray-800 !text-white-950 w-14"
            type="number"
            min={1}
            value={bridge()?.stringCount.get()}
            onChange={(e) =>
              bridge()?.stringCount.set(parseInt(e.target.value) || 1)
            }
            />
          <div class="border border-gray-500 my-2 px-2 py-4 rounded-md flex flex-col justify-between gap-2">
            <For each={bridge()?.stringSpawnPoint.state()}>
              {(sp, i) => (
                  <ToggleableButtonWithState
                    class="flex items-center"
                    isActive={!!sp.get()?.position.get()}
                    isFocus={bridge()?.stringSpawnPoint.selectedIndex.get() === i() && bridge()?.selectedItem.get() === "stringSpawnPoint"}
                    onClick={() => {
                      bridge()?.stringSpawnPoint.selectedIndex.set(i());
                      bridge()?.selectedItem.set("stringSpawnPoint");
                    }}
                  >
                    <span>String {i()+1}</span>
                  </ToggleableButtonWithState>
                )}
            </For>
          </div>
        </Show>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={bridge()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
