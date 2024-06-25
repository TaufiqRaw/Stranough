import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useGuitarJack } from "../jack-editor.page";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Texture } from "pixi.js";
import { useViewportContext } from "~/commons/components/viewport";
import { electricModelToPresenter } from "../../electric-model-editor/utils/functions/electric-model-to-presenter";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";

export function JackEditorPresenter() {
  const jack = createMemo(() => useGuitarJack().get());
  const viewportCtx = useViewportContext();
  const editorCtx = useEditorPageContext();
  const Jack = () => (
    <CommonPresenter
      texture={jack()?.texture.get()?.filename}
      pivot={jack()?.pivotPosition.get()}
      scale={jack()?.scale.get()}
      onClick={p=>{
        if(jack()?.selectedItem.get() === "pivot"){
          jack()?.pivotPosition.set((prev) => {
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
      fallback={Jack()}
    >
      <ElectricModelPresenter
        {...electricModelToPresenter(editorCtx!.modelPreview.selectedModel)}
        jack={{
          side : jack()?.isSide.get() ? Jack : undefined,
          top : jack()?.isSide.get() ? undefined : Jack,
        }}
      />
    </Show>
  );
}
