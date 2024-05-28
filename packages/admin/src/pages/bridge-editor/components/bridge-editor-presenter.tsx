import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { GuitarModelPresenter } from "~/pages/model-editor/guitar-model.presenter";
import { useGuitarBridge } from "../bridge-editor.page";
import { CommonPresenter } from "~/commons/components/common.presenter";

export function BridgeEditorPresenter() {
  const bridge = createMemo(() => useGuitarBridge().get());
  const editorCtx = useEditorPageContext();

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
        bridge()?.selectedItem.set(undefined);
      }}
    >
      <StringPointsIndicator />
      <Sprite zIndex={11} as={editorCtx?.sprites.target()} />
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
      fallback={Bridge()}
    >
      <GuitarModelPresenter
        body={editorCtx?.modelPreview.textures()!}
        spawnpoints={editorCtx?.modelPreview.spawnpoints()!}
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
