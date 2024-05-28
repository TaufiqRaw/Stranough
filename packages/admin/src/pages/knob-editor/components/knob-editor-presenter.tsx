import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { GuitarModelPresenter } from "~/pages/model-editor/guitar-model.presenter";
import { useGuitarKnob } from "../knob-editor.page";
import { CommonPresenter } from "~/commons/components/common.presenter";
import { Texture } from "pixi.js";

export function KnobEditorPresenter() {
  const knob = createMemo(() => useGuitarKnob().get());
  const editorCtx = useEditorPageContext();

  const Knob = () => (
    <CommonPresenter
      texture={knob()?.texture.get()?.filename}
      pivot={knob()?.pivotPosition.get()}
      scale={knob()?.scale.get()}
      onClick={p=>{
        if(knob()?.selectedItem.get() === "pivot"){
          knob()?.pivotPosition.set((prev) => {
            if (!prev)
              return {
                x: p.x,
                y: p.y,
              };
            return {
              x: prev.x + p.x,
              y: prev.y + p.y,
            };
          });
        }
        knob()?.selectedItem.set(undefined);
      }}
    >
      <Sprite 
        zIndex={11} 
        texture={editorCtx?.textures.target() ?? Texture.EMPTY}
        scale={0.2}
        anchor={0.5}
      />
    </CommonPresenter>
  );

  return (
    <Show
      when={
        editorCtx?.modelPreview.isShowModelPreview.get() &&
        editorCtx?.modelPreview.selectedModel() &&
        editorCtx?.modelPreview.textures() &&
        editorCtx?.modelPreview.spawnpoints()
      }
      fallback={Knob()}
    >
      <GuitarModelPresenter
        body={editorCtx?.modelPreview.textures()!}
        spawnpoints={editorCtx?.modelPreview.spawnpoints()!}
        knobs={Array.from({ length: 4 }, (_, i) => Knob)}
      />
    </Show>
  );
}
