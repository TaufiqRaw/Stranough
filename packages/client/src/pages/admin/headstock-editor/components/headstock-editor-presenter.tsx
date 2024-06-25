import { For, Setter, Show, createEffect, createMemo } from "solid-js";
import { Container, Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useGuitarHeadstock } from "../headstock-editor.page";
import { headstockToPresenter } from "../utils/headstock-to-presenter";
import { Color, Sprite as pxSprite, Texture } from "pixi.js";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { useViewportContext } from "~/commons/components/viewport";
import { HeadstockPresenter } from "~/commons/presenter/headstock.presenter";
import { electricModelToPresenter } from "../../electric-model-editor/utils/functions/electric-model-to-presenter";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";
import { NeckPresenter } from "~/commons/presenter/neck.presenter";

export function HeadstockEditorPresenter() {
  const headstock = createMemo(() => useGuitarHeadstock().get());
  const editorCtx = useEditorPageContext();
  const viewportCtx = useViewportContext();
  
  const isFront = createMemo(()=>viewportCtx?.isFront.get())

  const headstockPresenterProps = createMemo(() =>
    headstockToPresenter(headstock())
  );
  const Headstock = () => (
    <HeadstockPresenter
      {...headstockPresenterProps()}
      isFront={isFront}
      onClick={(p) => {
        if (headstock()?.selectedItem.get() === "pivot") {
          headstock()?.pivotPosition.set((prev) => {
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
        } else if (headstock()?.selectedItem.get() === 'pegsSpawnPoint'){
          headstock()?.getSelectedItem()?.set(p);
        }
      }}
    >
      <PegPointsIndicator />
      <Sprite
        zIndex={11}
        texture={viewportCtx?.textures.target() ?? Texture.EMPTY}
        scale={0.2}
        anchor={0.5}
      />
    </HeadstockPresenter>
  );
  return (
    <Show
      when={
        editorCtx?.modelPreview.isShowModelPreview.get() &&
        editorCtx?.modelPreview.selectedModel()
      }
      fallback={Headstock()}
    >
      <ElectricModelPresenter
        {...electricModelToPresenter(editorCtx!.modelPreview.selectedModel)}
        isFront={isFront?.()}
        fingerboard={() => (
          <NeckPresenter isFront={isFront} headstock={Headstock} />
        )}
      />
    </Show>
  );
}

function PegPointsIndicator() {
  const headstock = createMemo(() => useGuitarHeadstock().get());
  return (
    <For each={headstock()?.pegsSpawnPoint.state()}>
      {(point) => <CircleIndicator point={point.get()} />}
    </For>
  );
}

function CircleIndicator(props: { point?: {
  position: SignalObject<Position | undefined>;
  rotation: SignalObject<number |undefined>;
} }) {
  return (
    <Show when={props.point?.position?.get() !== undefined}>
      <Container
        position={{
          x: props.point?.position?.get()?.x ?? 0,
          y: props.point?.position?.get()?.y ?? 0,
        }}
        uses={c=>{
          c.rotation = props.point?.rotation?.get() ?? 0;
        }}
      >
        <Graphics
          zIndex={10}
          draw={[
            ["moveTo", -8, -6],
            ["lineTo", 8, -6],
            ["lineTo", 0, -20],
            ["closePath"],
            ['fill', new Color('blue')]
          ]}
        />
        <Graphics
          zIndex={10}
          draw={!!props.point?.position.get() ? Constants.indicatorGraphicDraw : []}
        />
      </Container>
    </Show>
  );
}
