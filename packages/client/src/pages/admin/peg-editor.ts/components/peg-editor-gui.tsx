import { For, Show, createMemo } from "solid-js";
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
import { Input } from "~/commons/components/input";

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
      >
        <Checkbox
          checked={peg()?.isBass.get}
          label="Is For Bass?"
          onChange={peg()?.isBass.set}
        />
        <Checkbox
          checked={peg()?.forSlottedHeadstock.get}
          label="For Slotted Headstock?"
          onChange={peg()?.forSlottedHeadstock.set}
        />
        <Show when={peg()?.forSlottedHeadstock.get}>
          <Checkbox
            checked={()=>peg()?.slottedGuardColor.get() !== undefined}
            label="Has Plate?"
            onChange={b=>{
              if(b){
                peg()?.slottedGuardColor.set('#000000');
                peg()?.slottedStringCount.set(6);
              }else{
                peg()?.slottedGuardColor.set(undefined);
                peg()?.slottedStringCount.set(undefined);
              }
            }}
          />
          <Show when={peg()?.slottedGuardColor.get()}>
            <span class="text-sm -mt-1">Plate Color (HEX)</span>
            <Input
              class="!bg-gray-800 !text-white-950"
              placeholder="Model Name"
              value={peg()?.slottedGuardColor.get()}
              oninput={(e) => {
                peg()?.slottedGuardColor.set(e.target.value);
              }}
            />
            <span class="text-sm -mt-1">Plate String Count</span>
            <Input
              class="!bg-gray-800 !text-white-950"
              value={peg()?.slottedStringCount.get()}
              oninput={(e) => peg()?.slottedStringCount.set(parseInt(e.target.value ?? '0'))}
              type="number"
              min={0}
            />
          </Show>
        </Show>
      </NameDescriptionGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Textures</span>
      </EditorGuiGroup>
      <EditorGuiGroup>
        <ImageInput
          label={`Peg ${peg()?.forSlottedHeadstock.get() ? 'Front' : 'Cap'} Texture`}
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
        <Show when={peg()?.forSlottedHeadstock.get()}>
          <ImageInput
            label="Peg Rod Texture"
            partType="peg"
            onError={(e) => console.error(e)}
            onLoad={(image) => {
              peg()?.pegRodTexture.set(image);
            }}
            onRemove={() => {
              peg()?.pegRodTexture.set(undefined);
            }}
            imageFilename={peg()?.pegRodTexture.get()?.filename}
          />
        </Show>
        <span>Scale</span>
        <Range
          value={peg()?.scale.get()}
          onChange={(e) => peg()?.scale.set(e)}
          step={0.01}
          min={0.05}
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
        <Show when={peg()?.forSlottedHeadstock.get()}>
          <ToggleableButton
            isActive={peg()?.selectedItem?.get() === "pegRodPivot"}
            onClick={() => peg()?.selectedItem?.set("pegRodPivot")}
          >
            Peg Rod Pivot Point
          </ToggleableButton>
        </Show>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={peg()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
