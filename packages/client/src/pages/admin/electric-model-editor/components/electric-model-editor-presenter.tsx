import {
  Container,
  Graphics,
  Sprite,
  useParent,
} from "solid-pixi";
import {
  For,
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
} from "solid-js";
import {
  GraphicsContext,
  Graphics as pxGraphics,
  Sprite as pxSprite,
  Texture,
  Container as pxContainer,
  Assets,
  Color,
} from "pixi.js";
import { Constants } from "~/constants";
import { useElectricModel } from "../electric-model-editor.page";
import { useViewportContext } from "~/commons/components/viewport";
import { electricModelToPresenter } from "../utils/functions/electric-model-to-presenter";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";
import { NeckPresenter } from "~/commons/presenter/neck.presenter";

export function ElectricModelEditorPresenter() {
  const model = createMemo(()=>useElectricModel().get())

  const viewportCtx = useViewportContext();
  const isFront = createMemo(()=>viewportCtx?.isFront.get())
  return (
    <Show when={!!model()?.selectedConstruction.get()}>
      <ElectricModelPresenter
        isFront={isFront?.()}
        {...electricModelToPresenter(model)}
        onGuitarClick={(e) => {
          model()
            ?.spawnPoints.getSelectedSignal()
            ?.set(e);
        }}
        fingerboard={model()?.spawnPoints.bridge.isShow.get() ? ()=><NeckPresenter isFront={isFront}/> : undefined}
      >
        <SpawnPointsIndicator />
      </ElectricModelPresenter>
    </Show>
  );
}

function SpawnPointsIndicator() {
  const guitarModel = useElectricModel();
  return (
    <For
      each={guitarModel.get()?.spawnPoints.asArray()}
    >
      {(point) => <Show when={point.position.get()}>
        <Show when={point.rotation?.get() === undefined}>
          <Graphics
            position={{
              x: point.position.get()?.x || 0,
              y: point.position.get()?.y || 0,
            }}
            zIndex={10}
            draw={!!point.position.get() ? Constants.indicatorGraphicDraw : []}
          />
        </Show>
        <Show when={point.rotation?.get() !== undefined}>
          <Container
            position={{
              x: point.position?.get()?.x ?? 0,
              y: point.position?.get()?.y ?? 0,
            }}
            uses={c=>{
              c.rotation = point.rotation?.get() ?? 0;
            }}
            zIndex={10}
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
              draw={!!point.position.get() ? Constants.indicatorGraphicDraw : []}
            />
          </Container>
        </Show>
      </Show>}
    </For>
  );
}

// const cornerIndicatorGraphics = new GraphicsContext();
// cornerIndicatorGraphics.circle(0, 0, 10).fill(new Color("black"));
