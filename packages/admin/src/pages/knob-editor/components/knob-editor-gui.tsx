import { For, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Button } from "~/commons/components/button";
import { GuitarModelPreviewExplorer } from "~/commons/components/guitar-model-preview-explorer";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useGuitarKnob } from "../knob-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { ToggleableButton } from "~/commons/components/toggleable-button";

export function KnobEditorGui() {
  const knob = createMemo(() => useGuitarKnob().get());

  return (
    <EditorGui>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Knob</span>
      </EditorGuiGroup>
      <GuitarModelPreviewExplorer />
      <NameDescriptionGroup
        description={knob()?.description}
        name={knob()?.name}
        placeholder={knob()?.placeholder}
      />
      <EditorGuiGroup>
        <span class="text-sm -mt-1">Texture</span>
        <ImageInput
          partType="knob"
          onError={(e) => console.error(e)}
          onLoad={(image) => {
            knob()?.texture.set(image);
          }}
          onRemove={() => {
            knob()?.texture.set(undefined);
          }}
          imageFilename={knob()?.texture.get()?.filename}
        />
        <span>Scale</span>
        <input
          type="range"
          value={knob()?.scale.get()}
          oninput={(e) => knob()?.scale.set(parseFloat(e.target.value))}
          step={0.01}
          min={0.25}
          max={2}
        />
      </EditorGuiGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Points</span>
        <ToggleableButton
          isActive={knob()?.selectedItem?.get() === "pivot"}
          onClick={() => knob()?.selectedItem?.set("pivot")}
        >
          Pivot Point
        </ToggleableButton>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={knob()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
