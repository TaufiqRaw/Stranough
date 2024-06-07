import { For, Show, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup, keyboardMove } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Input } from "~/commons/components/input";
import ToggleableButtonWithState from "~/commons/components/toggleable-button-with-state";
import * as R from "remeda";
import { Constants } from "~/constants";
import { Button } from "~/commons/components/button";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { GuitarModelPreviewExplorer } from "~/commons/components/guitar-model-preview-explorer";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useGuitarHeadstock } from "../headstock-editor.page";
import { Range } from "~/commons/components/range";

export function HeadstockEditorGui() {
  const headstock = createMemo(() => useGuitarHeadstock().get());

  return (
    <EditorGui onKeydown={(key, t)=>{
      switch(key){
        case 'ArrowUp' :
        case 'ArrowDown' :
        case 'ArrowLeft' :
        case 'ArrowRight' : {
          keyboardMove(key, t, (speed) => headstock()?.getSelectedItem()?.set((prev) => ({
            x: ((prev?.x ?? 0) + speed.x),
            y: ((prev?.y ?? 0) + speed.y),
          })));
          break;
        }
        case 'x' : {
          headstock()?.getSelectedItem()?.set((prev)=>({x : 0, y : prev?.y ?? 0}));
          break;
        }
        case 'Escape' : {
          headstock()?.selectedItem.set();
          break;
        }
      }
    }}>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Headstock</span>
      </EditorGuiGroup>
      <GuitarModelPreviewExplorer />
      <NameDescriptionGroup
        description={headstock()?.description}
        name={headstock()?.name}
        placeholder={headstock()?.placeholder}
        price={headstock()?.price}
      />
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Textures</span>
      </EditorGuiGroup>
      <EditorGuiGroup>
        <ImageInput
          label="Mask"
          partType="headstock"
          onLoad={(image) => {
            headstock()?.texture.set(image);
          }}
          onRemove={() => {
            headstock()?.texture.set(undefined);
          }}
          imageFilename={headstock()?.texture.get()?.filename}
        />
        <ImageInput
          label="Front Shadow"
          partType="headstock"
          onLoad={(image) => {
            headstock()?.frontShadowTexture.set(image);
          }}
          onRemove={() => {
            headstock()?.frontShadowTexture.set(null);
          }}
          imageFilename={headstock()?.frontShadowTexture.get()?.filename}/>
          <ImageInput
            label="Back Shadow"
            partType="headstock"
            onLoad={(image) => {
              headstock()?.backShadowTexture.set(image);
            }}
            onRemove={() => {
              headstock()?.backShadowTexture.set(null);
            }}
            imageFilename={headstock()?.backShadowTexture.get()?.filename}/>
        <span>Scale</span>
        <Range
          value={headstock()?.scale.get()}
          onChange={(e) => headstock()?.scale.set(e)}
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
          isActive={headstock()?.selectedItem?.get() === "pivot"}
          onClick={() => headstock()?.selectedItem?.set("pivot")}
        >
          Pivot Point
        </ToggleableButton>
        <span class="text-sm -mt-1">String Points</span>
        <Input
          class="!bg-gray-800 !text-white-950 w-14"
          type="number"
          min={1}
          value={headstock()?.stringCount.get()}
          onChange={(e) =>
            headstock()?.stringCount.set(parseInt(e.target.value) || 1)
          }
        />
        <div class="border border-gray-500 my-2 px-2 py-4 rounded-md flex flex-col justify-between gap-2">
          <For each={headstock()?.pegsSpawnPoint.state()}>
            {(sp, i) => (
                <ToggleableButtonWithState
                  class="flex items-center"
                  isActive={!!sp.get()?.position.get()}
                  isFocus={headstock()?.pegsSpawnPoint.selectedIndex.get() === i() && headstock()?.selectedItem.get() === "pegsSpawnPoint"}
                  onClick={() => {
                    headstock()?.pegsSpawnPoint.selectedIndex.set(i());
                    headstock()?.selectedItem.set("pegsSpawnPoint");
                  }}
                >
                  <Show when={!!sp.get()?.position.get()} 
                    fallback={<span>Peg {i()+1}</span>}
                  >
                    <Range
                      class="w-36"
                      value={sp.get()?.rotation.get()}
                      onChange={(e) => sp.get()?.rotation.set(e)}
                      step={0.01}
                      min={-Math.PI}
                      max={Math.PI}
                    />
                  </Show>
                </ToggleableButtonWithState>
              )}
          </For>
        </div>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={headstock()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
