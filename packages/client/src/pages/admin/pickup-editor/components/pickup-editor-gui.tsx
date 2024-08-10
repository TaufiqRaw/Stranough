import { For, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup, keyboardMove } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Button } from "~/commons/components/button";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useGuitarPickup } from "../pickup-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { Option, Select } from "~/commons/components/select";
import { ElectricModelPreviewExplorer } from "~/commons/components/electric-model-preview-explorer";
import { Pickup as PickupConfig } from "stranough-common";

export function PickupEditorGui() {
  const pickup = createMemo(() => useGuitarPickup().get());

  return (
    <EditorGui onKeydown={(key, t)=>{
      switch(key){
        case 'ArrowUp' :
        case 'ArrowDown' :
        case 'ArrowLeft' :
        case 'ArrowRight' : {
          keyboardMove(key, t, (speed) => pickup()?.getSelectedItem()?.set((prev) => ({
            x: ((prev?.x ?? 0) + speed.x),
            y: ((prev?.y ?? 0) + speed.y),
          })));
          break;
        }
        case 'x' : {
          pickup()?.getSelectedItem()?.set((prev)=>({x : 0, y : prev?.y ?? 0}));
          break;
        }
        case 'Escape' : {
          pickup()?.selectedItem.set();
          break;
        }
      }
    }}>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Pickup</span>
      </EditorGuiGroup>
      <ElectricModelPreviewExplorer />
      <NameDescriptionGroup
        description={pickup()?.description}
        name={pickup()?.name}
        placeholder={pickup()?.placeholder}
        price={pickup()?.price}
        thumbnail={pickup()?.thumbnail}
      />
      <EditorGuiGroup>
        <div class="flex gap-2 items-center">
        <div class="flex gap-2 items-center w-full">
          <span class="text-sm -mt-1">Type</span>
          <div class="flex-grow">  
            <Select 
              value={pickup()?.type.get()}
              onChange={(value) => pickup()?.type.set(value as 'single' | 'humbucker' | 'p90')}
            >
              <For each={Object.values(PickupConfig.PickupType)}>
                {(type) => <Option value={type}>{type}</Option>}
              </For>
            </Select>
          </div>
        </div>
        </div>
        <ImageInput
          label="Texture"
          partType="pickup"
          onError={(e) => console.error(e)}
          onLoad={(image) => {
            pickup()?.texture.set(image);
          }}
          onRemove={() => {
            pickup()?.texture.set(undefined);
          }}
          imageFilename={pickup()?.texture.get()?.filename}
        />
        <span>Scale</span>
        <input
          type="range"
          value={pickup()?.scale.get()}
          oninput={(e) => pickup()?.scale.set(parseFloat(e.target.value))}
          step={0.01}
          min={0.25}
          max={2}
        />
      </EditorGuiGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Points</span>
        <ToggleableButton
          isActive={pickup()?.selectedItem?.get() === "pivot"}
          onClick={() => pickup()?.selectedItem?.set("pivot")}
        >
          Pivot Point
        </ToggleableButton>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={pickup()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
