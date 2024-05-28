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
import { DropShadowFilter } from "pixi-filters";
import { getFretDistances } from "../utils/functions/get-fret-distances";
import { GuitarModelPresenter } from "~/pages/model-editor/guitar-model.presenter";
import { RenderedGraphics } from "solid-pixi";
import { guitarModelToPresenter } from "~/pages/model-editor/utils/functions/guitar-model-to-presenter";
import { Constants } from "~/constants";
import { useGuitarModel } from "../model-editor.page";
import { useEditorPageContext } from "~/commons/components/editor-page";

const emptyGraphics = new GraphicsContext();

export function ModelEditorPresenter() {
  const editorCtx = useEditorPageContext();
  const viewport = useParent();
  const guitarModel = createMemo(()=>useGuitarModel().get())
  const {selectedTexture, spawnpoints} = guitarModelToPresenter(guitarModel);
  
  return (
    <Show when={!!selectedTexture()}>
      <GuitarModelPresenter
        isFront={editorCtx?.isFront.get() ?? true}
        position={{
          x: viewport.width / 2,
          y: viewport.height / 2,
        }}
        body={selectedTexture()!}
        spawnpoints={spawnpoints()!}
        onGuitarClick={(e) => {
          guitarModel()
            ?.spawnPoints.getSelectedSignal()
            ?.set(e);
          guitarModel()
            ?.spawnPoints.selected.set(undefined);
        }}
      >
        <SpawnPointsIndicator />
        <Fingerboard />
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
            zIndex={1}
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
              zIndex={1}
              draw={[
                ["moveTo", -8, -6],
                ["lineTo", 8, -6],
                ["lineTo", 0, -20],
                ["closePath"],
                ['fill', new Color('blue')]
              ]}
            />
            <Graphics
              zIndex={1}
              draw={!!point.position.get() ? Constants.indicatorGraphicDraw : []}
            />
          </Container>
        </Show>
      </Show>}
    </For>
  );
}

function Fingerboard() {
  const fretDistance = getFretDistances(25.5, 24);

  const [guitarFingerboardMask, setGuitarFingerboardMask] =
    createSignal<pxSprite | null>(null);
  const guitarModel = useGuitarModel();
  const [woodTextures] = createResource(async () => {
    return (await Assets.load("/assets/alder.jpg")) as Texture;
  });

  return (
    <Show
      when={
        !!guitarModel
          .get()!
          ?.spawnPoints.fingerboard.position.get() &&
        guitarModel
          .get()!
          ?.spawnPoints.fingerboard.isShow.get()
      }
    >
      <Container
        position={guitarModel
          .get()!
          ?.spawnPoints.fingerboard.position.get()}
        uses={(c) => {
          c.filters = [
            new DropShadowFilter({
              blur: 4,
              offset: { x: 0, y: 4 },
              alpha: 0.3,
            }),
          ];
        }}
      >
        <Container mask={guitarFingerboardMask()}>
          <Sprite
            texture={woodTextures() ?? Texture.EMPTY}
            anchor={{ x: 0.5, y: 1 }}
            scale={1.15}
          />
          <RenderedGraphics
            uses={setGuitarFingerboardMask}
            anchor={{ x: 0.5, y: 1 }}
            draw={[
              ["moveTo", -38, 0],
              ["lineTo", 38, 0],
              ["lineTo", 30, -668],
              ["lineTo", -30, -668],
              ["fill", { color: 0xffffff }],
            ]}
          />

          {fretDistance.map((d) => (
            <Graphics
              position={{ x: 0, y: -668 + 50 + d * 32.3 }}
              draw={[
                ["rect", -35, 0, 70, 2],
                ["fill", { color: 0xffffff }],
              ]}
            />
          ))}
        </Container>
      </Container>
    </Show>
  );
}

// const cornerIndicatorGraphics = new GraphicsContext();
// cornerIndicatorGraphics.circle(0, 0, 10).fill(new Color("black"));
