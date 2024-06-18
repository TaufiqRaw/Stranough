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
import { useGuitarNut } from "../nut-editor.page";
import { ElectricModelPreviewExplorer } from "~/commons/components/electric-model-preview-explorer";

export function NutEditorGui() {
  const nut = createMemo(() => useGuitarNut().get());

  return (
    <EditorGui onKeydown={(key, t)=>{
      switch(key){
        case 'ArrowUp' :
        case 'ArrowDown' :
        case 'ArrowLeft' :
        case 'ArrowRight' : {
          keyboardMove(key, t, (speed) => nut()?.getSelectedItem()?.set((prev) => ({
            x: ((prev?.x ?? 0) + speed.x),
            y: ((prev?.y ?? 0) + speed.y),
          })));
          break;
        }
        case 'x' : {
          nut()?.getSelectedItem()?.set((prev)=>({x : 0, y : prev?.y ?? 0}));
          break;
        }
        case 'Escape' : {
          nut()?.selectedItem.set();
          break;
        }
      }
    }}>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Nut</span>
      </EditorGuiGroup>
      <ElectricModelPreviewExplorer />
      <NameDescriptionGroup
        description={nut()?.description}
        name={nut()?.name}
        placeholder={nut()?.placeholder}
        price={nut()?.price}
        thumbnail={nut()?.thumbnail}
      />
      <EditorGuiGroup>
        <ImageInput
          label="Texture"
          partType="nut"
          onError={(e) => console.error(e)}
          onLoad={(image) => {
            nut()?.texture.set(image);
          }}
          onRemove={() => {
            nut()?.texture.set(undefined);
          }}
          imageFilename={nut()?.texture.get()?.filename}
        />
        <span>Scale</span>
        <input
          type="range"
          value={nut()?.scale.get()}
          oninput={(e) => nut()?.scale.set(parseFloat(e.target.value))}
          step={0.01}
          min={0.25}
          max={2}
        />
      </EditorGuiGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Points</span>
      </EditorGuiGroup>
      <EditorGuiGroup>
        <ToggleableButton
          isActive={nut()?.selectedItem?.get() === "pivot"}
          onClick={() => nut()?.selectedItem?.set("pivot")}
        >
          Pivot Point
        </ToggleableButton>
        <span class="text-sm -mt-1">String Points</span>
        <Input
          class="!bg-gray-800 !text-white-950 w-14"
          type="number"
          min={1}
          value={nut()?.stringCount.get()}
          onChange={(e) =>
            nut()?.stringCount.set(parseInt(e.target.value) || 1)
          }
        />
        <For each={nut()?.stringSpawnPoint.state()}>
          {(sp, i) => (
            <ToggleableButtonWithState
            class="flex items-center"
            isActive={!!sp.get()}
            isFocus={nut()?.stringSpawnPoint.selectedIndex.get() === i()}
            onClick={() => {
              nut()?.stringSpawnPoint.selectedIndex.set(i());
              nut()?.selectedItem.set("stringSpawnPoint");
              }}
            >
              <span>String {i()+1}</span>
            </ToggleableButtonWithState>
          )}
        </For>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={nut()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
