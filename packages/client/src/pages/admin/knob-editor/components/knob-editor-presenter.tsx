import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useGuitarKnob } from "../knob-editor.page";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Texture } from "pixi.js";
import { useViewportContext } from "~/commons/components/viewport";
import { electricModelToPresenter } from "../../electric-model-editor/utils/functions/electric-model-to-presenter";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";

export function KnobEditorPresenter() {
  const knob = createMemo(() => useGuitarKnob().get());
  const editorCtx = useEditorPageContext();
  const viewportCtx = useViewportContext();

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
      }}
    >
      <Sprite 
        zIndex={11} 
        texture={viewportCtx?.textures.target() ?? Texture.EMPTY}
        scale={0.2}
        anchor={0.5}
      />
    </CommonPresenter>
  );

  return (
    <Show
      when={
        editorCtx?.modelPreview.isShowModelPreview.get() &&
        editorCtx?.modelPreview.selectedModel()
      }
      fallback={Knob()}
    >
      <ElectricModelPresenter
        {...electricModelToPresenter(editorCtx!.modelPreview.selectedModel)}
        knobs={Array.from({ length: 4 }, (_, i) => Knob)}
      />
    </Show>
  );
}
