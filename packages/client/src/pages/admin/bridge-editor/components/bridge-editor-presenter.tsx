import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useGuitarBridge } from "../bridge-editor.page";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Texture } from "pixi.js";
import { useViewportContext } from "~/commons/components/viewport";
import { electricModelToPresenter } from "../../electric-model-editor/utils/functions/electric-model-to-presenter";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";

export function BridgeEditorPresenter() {
  const bridge = createMemo(() => useGuitarBridge().get());
  const editorCtx = useEditorPageContext();
  const viewportCtx = useViewportContext();

  const Bridge = () => (
    <CommonPresenter
      texture={bridge()?.texture.get()?.filename}
      pivot={bridge()?.pivotPosition.get()}
      scale={bridge()?.scale.get()}
      onClick={(p) => {
        if (bridge()?.selectedItem.get() === "pivot") {
          bridge()?.pivotPosition.set((prev) => {
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
        } else bridge()?.getSelectedItem()?.set(p);
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
      fallback={Bridge()}
    >
      <ElectricModelPresenter
        {...electricModelToPresenter(editorCtx!.modelPreview.selectedModel)}
        bridge={Bridge}
      />
    </Show>
  );
}

function StringPointsIndicator() {
  const bridge = createMemo(() => useGuitarBridge().get());
  return (
    <For each={bridge()?.stringSpawnPoint.state()}>
      {(pp) => (
        <For each={pp.state()}>
          {(point) => <CircleIndicator point={point.get()} />}
        </For>
      )}
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
