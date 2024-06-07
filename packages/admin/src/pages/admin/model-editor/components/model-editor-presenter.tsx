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
import { guitarModelToPresenter } from "~/pages/admin/model-editor/utils/functions/guitar-model-to-presenter";
import { Constants } from "~/constants";
import { useGuitarModel } from "../model-editor.page";
import { FingerboardPresenter } from "~/commons/presenter/fingerboard.presenter";
import { useViewportContext } from "~/commons/components/viewport";
import { GuitarModelPresenter } from "~/commons/presenter/guitar-model.presenter";

export function ModelEditorPresenter() {
  const model = createMemo(()=>useGuitarModel().get())

  const viewportCtx = useViewportContext();
  const isFront = createMemo(()=>viewportCtx?.isFront.get())
  
  return (
    <Show when={!!model()?.getSelectedBodySignal()?.getSelectedBodyTextureSignal()}>
      <GuitarModelPresenter
        isFront={isFront?.()}
        {...guitarModelToPresenter(model)}
        onGuitarClick={(e) => {
          model()
            ?.spawnPoints.getSelectedSignal()
            ?.set(e);
        }}
        fingerboard={model()?.spawnPoints.fingerboard.isShow.get() ? ()=><FingerboardPresenter isFront={isFront?.()}/> : undefined}
      >
        <SpawnPointsIndicator />
      </GuitarModelPresenter>
    </Show>
  );
}

function SpawnPointsIndicator() {
  const guitarModel = useGuitarModel();
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
