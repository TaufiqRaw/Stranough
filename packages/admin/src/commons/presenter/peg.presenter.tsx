import {
  Sprite as pxSprite,
  Container as pxContainer,
  FederatedMouseEvent,
  Point,
  Texture,
} from "pixi.js";
import {
  JSX,
  Show,
  Suspense,
  mergeProps,
  onCleanup,
} from "solid-js";
import { Container, Sprite } from "solid-pixi";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { Position } from "~/commons/interfaces/position";
import { useHeadstockContext } from "./headstock.presenter";

export function PegPresenter(_props: {
  texture ?: {
    cap ?: string;
    back ?: string;
  }
  pivot?: Position;
  backPivot?: Position;
  scale?: number;
  isFront?: boolean;
  onCapClick?: (e: Point) => void;
  onBackClick?: (e: Point) => void;
  children?: JSX.Element;
  backChildren ?: JSX.Element;
  zIndex?: number;
}) {
  const props = mergeProps({ isFront: true }, _props);
  const headstockCtx = useHeadstockContext();
  
  const selectedTex = {
    cap: createPixiTexture(() => props.texture?.cap),
    back: createPixiTexture(() => props.texture?.back),
  };

  return (
    <Show when={selectedTex.back() && selectedTex.cap()}>
      <Suspense>
        <Container
          position={headstockCtx?.childSpawnPos ?? { x: 0, y: 0 }}
          rotation={headstockCtx?.childSpawnPos?.rotation ?? 0}
          zIndex={props.isFront ? 2 : 0}
          interactive
          uses={[
            (container) => {
              if(!props.onCapClick) return;

              function listener(e: FederatedMouseEvent) {
                const newPoint = container.toLocal(e.global);
                props.onCapClick!(newPoint);
              }

              container.on("pointerdown", listener);
              onCleanup(() => container.off("pointerdown", listener));
            },
          ]}
        >
          <Sprite
            pivot={props.pivot ?? { x: 0, y: 0 }}
            texture={selectedTex.cap() ?? Texture.EMPTY}
            scale={props.scale ?? 1}
          />
          {props.children}
        </Container>
        <Container
          position={headstockCtx?.childSpawnPos ?? { x: 0, y: 0 }}
          rotation={headstockCtx?.childSpawnPos?.rotation ?? 0}
          zIndex={props.isFront ? 0 : 2}
          interactive
          uses={[
            (container) => {
              if(!props.onBackClick) return;

              function listener(e: FederatedMouseEvent) {
                const newPoint = container.toLocal(e.global);
                props.onBackClick!(newPoint);
              }

              container.on("pointerdown", listener);
              onCleanup(() => container.off("pointerdown", listener));
            },
          ]}
        >
          <Sprite
            pivot={props.backPivot ?? { x: 0, y: 0 }}
            texture={selectedTex.back() ?? Texture.EMPTY}
            scale={props.scale ?? 1}
          />
          {props.backChildren}
        </Container>
      </Suspense>
    </Show>
  );
}
