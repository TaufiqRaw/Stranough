import { For, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup, keyboardMove } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Button } from "~/commons/components/button";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useGuitarJack } from "../jack-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { ElectricModelPreviewExplorer } from "~/commons/components/electric-model-preview-explorer";

export function JackEditorGui() {
  const jack = createMemo(() => useGuitarJack().get());

  return (
    <EditorGui onKeydown={(key, t)=>{
      switch(key){
        case 'ArrowUp' :
        case 'ArrowDown' :
        case 'ArrowLeft' :
        case 'ArrowRight' : {
          keyboardMove(key, t, (speed) => jack()?.getSelectedItem()?.set((prev) => ({
            x: ((prev?.x ?? 0) + speed.x),
            y: ((prev?.y ?? 0) + speed.y),
          })));
          break;
        }
        case 'x' : {
          jack()?.getSelectedItem()?.set((prev)=>({x : 0, y : prev?.y ?? 0}));
          break;
        }
        case 'Escape' : {
          jack()?.selectedItem.set();
          break;
        }
      }
    }}>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Jack</span>
      </EditorGuiGroup>
      <ElectricModelPreviewExplorer />
      <NameDescriptionGroup
        description={jack()?.description}
        name={jack()?.name}
        placeholder={jack()?.placeholder}
        price={jack()?.price}
        thumbnail={jack()?.thumbnail}
      />
      <EditorGuiGroup>
        <div class="flex gap-2 items-center">
          <Checkbox label={<span class="text-sm -mt-1">Side Jack</span>} checked={jack()?.isSide.get} onChange={jack()?.isSide.set}/>
        </div>
        <span class="text-sm -mt-1">Texture</span>
        <ImageInput
          label="Texture"
          partType="jack"
          onError={(e) => console.error(e)}
          onLoad={(image) => {
            jack()?.texture.set(image);
          }}
          onRemove={() => {
            jack()?.texture.set(undefined);
          }}
          imageFilename={jack()?.texture.get()?.filename}
        />
        <span>Scale</span>
        <input
          type="range"
          value={jack()?.scale.get()}
          oninput={(e) => jack()?.scale.set(parseFloat(e.target.value))}
          step={0.01}
          min={0.25}
          max={2}
        />
      </EditorGuiGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Points</span>
        <ToggleableButton
          isActive={jack()?.selectedItem?.get() === "pivot"}
          onClick={() => jack()?.selectedItem?.set("pivot")}
        >
          Pivot Point
        </ToggleableButton>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={jack()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
