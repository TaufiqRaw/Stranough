import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useGuitarSwitch } from "../switch-editor.page";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Texture } from "pixi.js";
import { useViewportContext } from "~/commons/components/viewport";
import { DropShadowFilter } from "pixi-filters";
import { electricModelToPresenter } from "../../electric-model-editor/utils/functions/electric-model-to-presenter";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";

export function SwitchEditorPresenter() {
  const gSwitch = createMemo(() => useGuitarSwitch().get());
  const viewportCtx = useViewportContext();
  const editorCtx = useEditorPageContext();
  const Switch = () => (
    <CommonPresenter
      filter={new DropShadowFilter({
        blur: 4,
        alpha: 0.2,
      })}
      texture={gSwitch()?.texture.get()?.filename}
      pivot={gSwitch()?.pivotPosition.get()}
      scale={gSwitch()?.scale.get()}
      onClick={p=>{
        if(gSwitch()?.selectedItem.get() === "pivot"){
          gSwitch()?.pivotPosition.set((prev) => {
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
      fallback={Switch()}
    >
      <ElectricModelPresenter
        {...electricModelToPresenter(editorCtx!.modelPreview.selectedModel)}
        switch={Switch}
      />
    </Show>
  );
}
