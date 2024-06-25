import { Show, createMemo } from "solid-js";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { useGuitarPickguard } from "../pickguard-editor.page";
import { useViewportContext } from "~/commons/components/viewport";
import { electricModelToPresenter } from "../../electric-model-editor/utils/functions/electric-model-to-presenter";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";
import { MaskedContainer } from "~/commons/presenter/masked-container.presenter";
import { Graphics, Sprite } from "solid-pixi";
import { Texture } from "pixi.js";

export function JackEditorPresenter() {
  const pickguard = createMemo(() => useGuitarPickguard().get());
  const editorCtx = useEditorPageContext();
  const viewportCtx = useViewportContext();

  const isFront = createMemo(() => viewportCtx?.isFront.get());
  const Pickguard = () => (
    <MaskedContainer 
      scale={pickguard()?.scale.get()}
      mask={pickguard()?.texture.get()?.filename}
      pivot={pickguard()?.pivotPosition.get()}
      interactive
      onClick={p=>{
        if(pickguard()?.selectedItem.get() === "pivot"){
          pickguard()?.pivotPosition.set((prev) => {
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
      {({ maskTexture }) => {
        return <>
          <Graphics
            pivot={pickguard()?.pivotPosition.get()}
            scale={pickguard()?.scale.get()}
            draw={[
              ["rect",0,0 ,maskTexture()?.width ?? 0, maskTexture()?.height ?? 0],
              ["fill", (editorCtx?.modelPreview.isShowModelPreview.get() ? '0xffffff' : '0xff0000'), 1],
            ]}
          />
          <Sprite 
            zIndex={11} 
            texture={viewportCtx?.textures.target() ?? Texture.EMPTY}
            scale={0.2}
            anchor={0.5}
          />
        </>;
      }}
    </MaskedContainer>
  );

  return (
    <Show
      when={
        editorCtx?.modelPreview.isShowModelPreview.get() &&
        editorCtx?.modelPreview.selectedModel()
      }
      fallback={Pickguard()}
    >
      <ElectricModelPresenter
        {...electricModelToPresenter(editorCtx!.modelPreview.selectedModel)}
        isFront={isFront?.()}
        pickguard={Pickguard}
      />
    </Show>
  );
}
