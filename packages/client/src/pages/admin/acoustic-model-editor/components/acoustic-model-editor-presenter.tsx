import { For, Show, createMemo } from "solid-js";
import { Container, Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useAcousticGuitarModel } from "../acoustic-guitar-model-editor.page";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Color, Texture } from "pixi.js";
import { useViewportContext } from "~/commons/components/viewport";
import { electricModelToPresenter } from "../../electric-model-editor/utils/functions/electric-model-to-presenter";
import { AcousticModelPresenter } from "~/commons/presenter/guitar-model/acoustic-model.presenter";
import { acousticModelToPresenter } from "../utils/acoustic-model-to-presenter";
import { NeckPresenter } from "~/commons/presenter/neck.presenter";

export function AcousticModelEditorPresenter() {
  const model = useAcousticGuitarModel()!.get;
  const viewportCtx = useViewportContext();
  const editorCtx = useEditorPageContext();
  
  return (
    
      <AcousticModelPresenter
        {...acousticModelToPresenter(model)}
        isFront={viewportCtx?.isFront.get()}
        onGuitarClick={(e) => {
          model()
            ?.spawnPoints.getSelectedSignal()
            ?.set(e);
        }}
        fingerboard={model()?.spawnPoints.fingerboard.isShow.get() ? ()=><NeckPresenter/> : undefined}
      >
        <SpawnPointsIndicator />
      </AcousticModelPresenter>
  );
}


function SpawnPointsIndicator() {
  const guitarModel = useAcousticGuitarModel();
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
