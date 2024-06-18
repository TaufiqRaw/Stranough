import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useGuitarNut } from "../nut-editor.page";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Texture } from "pixi.js";
import { NeckPresenter } from "~/commons/presenter/fingerboard.presenter";
import { useViewportContext } from "~/commons/components/viewport";
import { GuitarModelPresenter } from "~/commons/presenter/guitar-model/guitar-model.presenter";
import { guitarModelToPresenter } from "../../electric-model-editor/utils/functions/guitar-model-to-presenter";

export function NutEditorPresenter() {
  const nut = createMemo(() => useGuitarNut().get());
  const editorCtx = useEditorPageContext();
  const viewportCtx = useViewportContext();

  const isFront = createMemo(() => viewportCtx?.isFront.get());

  const Nut = () => (
    <CommonPresenter
      texture={nut()?.texture.get()?.filename}
      pivot={nut()?.pivotPosition.get()}
      scale={nut()?.scale.get()}
      onClick={(p) => {
        if (nut()?.selectedItem.get() === "pivot") {
          nut()?.pivotPosition.set((prev) => {
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
        } else nut()?.getSelectedItem()?.set(p);
        nut()?.selectedItem.set(undefined);
      }}
    >
      <StringPointsIndicator />
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
      fallback={Nut()}
    >
      <GuitarModelPresenter
        isFront={isFront?.()}
        {...guitarModelToPresenter(editorCtx!.modelPreview.selectedModel!)}
        fingerboard={()=><NeckPresenter
          nut={Nut}
        />}
      />
    </Show>
  );
}

function StringPointsIndicator() {
  const nut = createMemo(() => useGuitarNut().get());
  return (
    <For each={nut()?.stringSpawnPoint.state()}>
      {(point) => <CircleIndicator point={point.get()} />}
    </For>
  );
}

function CircleIndicator(props: { point?: Position | undefined }) {
  return (
    <Show when={props.point}>
      <Graphics
        position={{
          x: props.point?.x ?? 0,
          y: props.point?.y ?? 0,
        }}
        zIndex={10}
        draw={props.point ? Constants.indicatorGraphicDraw : []}
      />
    </Show>
  );
}
