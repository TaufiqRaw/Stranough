import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useGuitarPeg } from "../peg-editor.page";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Texture } from "pixi.js";
import { headstockToPresenter } from "~/pages/admin/headstock-editor/utils/headstock-to-presenter";
import { pegToPresenter } from "../utils/peg-to-presenter";
import { useViewportContext } from "~/commons/components/viewport";
import { PegPresenter } from "~/commons/presenter/peg.presenter";
import { HeadstockPresenter } from "~/commons/presenter/headstock.presenter";
import { electricModelToPresenter } from "../../electric-model-editor/utils/functions/electric-model-to-presenter";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";
import { NeckPresenter } from "~/commons/presenter/neck.presenter";

export function PegEditorPresenter() {
  const peg = createMemo(() => useGuitarPeg().get());
  const viewportCtx = useViewportContext();
  const editorCtx = useEditorPageContext();

  const isFront = createMemo(()=>viewportCtx?.isFront.get())

  const Peg = () => <PegPresenter
    {...pegToPresenter(peg()!)}
    clickable={()=>{
      switch(peg()?.selectedItem.get()){
        case 'pegBackPivot' : return 'back';
        case 'pegRodPivot' : return 'rod';
        case 'pivot' : return 'cap';
        default : return undefined;
      }
    }}
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
    onRodClick={(p: Position) => {
      if(peg()?.selectedItem.get() === 'pegRodPivot')
        peg()?.pegRodPivotPosition.set((prev) => {
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
    rodChildren={
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
      <ElectricModelPresenter
        isFront={isFront()}
        {...electricModelToPresenter(editorCtx!.modelPreview.selectedModel)}
        spawnpoints={electricModelToPresenter(editorCtx!.modelPreview.selectedModel)?.spawnpoints}
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
