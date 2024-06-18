import { For, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup, keyboardMove } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Button } from "~/commons/components/button";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useGuitarPeg } from "../peg-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { GuitarHeadstockPreviewExplorer } from "~/commons/components/guitar-headstock-preview-explorer";
import { Range } from "~/commons/components/range";
import { ElectricModelPreviewExplorer } from "~/commons/components/electric-model-preview-explorer";

export function PegEditorGui() {
  const peg = createMemo(() => useGuitarPeg().get());

  return (
    <EditorGui onKeydown={(key, t)=>{
      switch(key){
        case 'ArrowUp' :
        case 'ArrowDown' :
        case 'ArrowLeft' :
        case 'ArrowRight' : {
          keyboardMove(key, t, (speed) => peg()?.getSelectedItem()?.set((prev) => ({
            x: ((prev?.x ?? 0) + speed.x),
            y: ((prev?.y ?? 0) + speed.y),
          })));
          break;
        }
        case 'x' : {
          peg()?.getSelectedItem()?.set((prev)=>({x : 0, y : prev?.y ?? 0}));
          break;
        }
        case 'Escape' : {
          peg()?.selectedItem.set();
          break;
        }
      }
    }}>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Peg</span>
      </EditorGuiGroup>
      <ElectricModelPreviewExplorer />
      <GuitarHeadstockPreviewExplorer/>
      <NameDescriptionGroup
        description={peg()?.description}
        name={peg()?.name}
        placeholder={peg()?.placeholder}
        price={peg()?.price}
        thumbnail={peg()?.thumbnail}
      />
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Textures</span>
      </EditorGuiGroup>
      <EditorGuiGroup>
        <ImageInput
          label="Peg Cap Texture"
          partType="peg"
          onError={(e) => console.error(e)}
          onLoad={(image) => {
            peg()?.pegCapTexture.set(image);
          }}
          onRemove={() => {
            peg()?.pegCapTexture.set(undefined);
          }}
          imageFilename={peg()?.pegCapTexture.get()?.filename}
        />
        <ImageInput
          label="Peg Back Texture"
          partType="peg"
          onError={(e) => console.error(e)}
          onLoad={(image) => {
            peg()?.pegBackTexture.set(image);
          }}
          onRemove={() => {
            peg()?.pegBackTexture.set(undefined);
          }}
          imageFilename={peg()?.pegBackTexture.get()?.filename}
        />
        <span>Scale</span>
        <Range
          value={peg()?.scale.get()}
          onChange={(e) => peg()?.scale.set(e)}
          step={0.01}
          min={0.25}
          max={2}
        />
      </EditorGuiGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Points</span>
        <ToggleableButton
          isActive={peg()?.selectedItem?.get() === "pivot"}
          onClick={() => peg()?.selectedItem?.set("pivot")}
        >
          Pivot Point
        </ToggleableButton>
        <ToggleableButton
          isActive={peg()?.selectedItem?.get() === "pegBackPivot"}
          onClick={() => peg()?.selectedItem?.set("pegBackPivot")}
        >
          Peg Back Pivot Point
        </ToggleableButton>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={peg()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
