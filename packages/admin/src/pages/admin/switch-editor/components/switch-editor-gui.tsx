import { For, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup, keyboardMove } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Button } from "~/commons/components/button";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useGuitarSwitch } from "../switch-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { Option, Select } from "~/commons/components/select";
import { ElectricModelPreviewExplorer } from "~/commons/components/electric-model-preview-explorer";

export function SwitchEditorGui() {
  const gSwitch = createMemo(() => useGuitarSwitch().get());

  return (
    <EditorGui onKeydown={(key, t)=>{
      switch(key){
        case 'ArrowUp' :
        case 'ArrowDown' :
        case 'ArrowLeft' :
        case 'ArrowRight' : {
          keyboardMove(key, t, (speed) => gSwitch()?.getSelectedItem()?.set((prev) => ({
            x: ((prev?.x ?? 0) + speed.x),
            y: ((prev?.y ?? 0) + speed.y),
          })));
          break;
        }
        case 'x' : {
          gSwitch()?.getSelectedItem()?.set((prev)=>({x : 0, y : prev?.y ?? 0}));
          break;
        }
        case 'Escape' : {
          gSwitch()?.selectedItem.set();
          break;
        }
      }
    }}>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Pickup</span>
      </EditorGuiGroup>
      <ElectricModelPreviewExplorer />
      <NameDescriptionGroup
        description={gSwitch()?.description}
        name={gSwitch()?.name}
        placeholder={gSwitch()?.placeholder}
        price={gSwitch()?.price}
        thumbnail={gSwitch()?.thumbnail}
      />
      <EditorGuiGroup>
        <ImageInput
          label="Texture"
          partType="switch"
          onError={(e) => console.error(e)}
          onLoad={(image) => {
            gSwitch()?.texture.set(image);
          }}
          onRemove={() => {
            gSwitch()?.texture.set(undefined);
          }}
          imageFilename={gSwitch()?.texture.get()?.filename}
        />
        <span>Scale</span>
        <input
          type="range"
          value={gSwitch()?.scale.get()}
          oninput={(e) => gSwitch()?.scale.set(parseFloat(e.target.value))}
          step={0.01}
          min={0.25}
          max={2}
        />
      </EditorGuiGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Points</span>
        <ToggleableButton
          isActive={gSwitch()?.selectedItem?.get() === "pivot"}
          onClick={() => gSwitch()?.selectedItem?.set("pivot")}
        >
          Pivot Point
        </ToggleableButton>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={gSwitch()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
