import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useGuitarPeg } from "../peg-editor.page";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Texture } from "pixi.js";
import { NeckPresenter } from "~/commons/presenter/fingerboard.presenter";
import { headstockToPresenter } from "~/pages/admin/headstock-editor/utils/headstock-to-presenter";
import { pegToPresenter } from "../utils/peg-to-presenter";
import { useViewportContext } from "~/commons/components/viewport";
import { PegPresenter } from "~/commons/presenter/peg.presenter";
import { GuitarModelPresenter } from "~/commons/presenter/guitar-model/guitar-model.presenter";
import { HeadstockPresenter } from "~/commons/presenter/headstock.presenter";
import { guitarModelToPresenter } from "../../electric-model-editor/utils/functions/guitar-model-to-presenter";

export function PegEditorPresenter() {
  const peg = createMemo(() => useGuitarPeg().get());
  const viewportCtx = useViewportContext();
  const editorCtx = useEditorPageContext();

  const isFront = createMemo(()=>viewportCtx?.isFront.get())

  const Peg = () => <PegPresenter
    {...pegToPresenter(peg()!)}
    isFront={isFront}
    onCapClick={(p: Position) => {
      if(peg()?.selectedItem.get() === 'pivot')
        peg()?.pivotPosition.set((prev) => {
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
    }}
    onBackClick={(p: Position) => {
      if(peg()?.selectedItem.get() === 'pegBackPivot')
        peg()?.pegBackPivotPosition.set((prev) => {
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
    }}
    backChildren={
      <Sprite 
        zIndex={11} 
        texture={viewportCtx?.textures.target() ?? Texture.EMPTY}
        scale={0.2}
        anchor={0.5}
      />
    }
  >
    <Sprite 
      zIndex={11} 
      texture={viewportCtx?.textures.target() ?? Texture.EMPTY}
      scale={0.2}
      anchor={0.5}
    />
  </PegPresenter>

  return (
    <Show
      when={
        editorCtx?.modelPreview.isShowModelPreview.get() &&
        editorCtx?.modelPreview.selectedModel() &&
        editorCtx?.headstockPreview.selectedHeadstock()
      }
      fallback={Peg()}
    >
      <GuitarModelPresenter
        isFront={isFront()}
        {...guitarModelToPresenter(editorCtx!.modelPreview.selectedModel)}
        spawnpoints={guitarModelToPresenter(editorCtx!.modelPreview.selectedModel)?.spawnpoints}
        fingerboard={()=><NeckPresenter
          isFront={isFront}
          headstock={()=><Show when={editorCtx?.headstockPreview.isShowHeadstockPreview.get()}><HeadstockPresenter
            {...headstockToPresenter(editorCtx!.headstockPreview.selectedHeadstock()!)}
            isFront={isFront}
            pegs={Array.from({length : 10}, (_,i)=>Peg)}
          /></Show>}
        />}
      />
    </Show>
  );
}
