import {
  Sprite as pxSprite,
  Container as pxContainer,
  FederatedMouseEvent,
  Point,
  Texture,
  Filter,
} from "pixi.js";
import {
  JSX,
  Show,
  Suspense,
  createSignal,
  onCleanup,
} from "solid-js";
import { Container, Sprite } from "solid-pixi";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { Position } from "~/commons/interfaces/position";

export function CommonPresenter(props: {
  texture?: string;
  pivot?: Position;
  scale?: number;
  onClick?: (e: Point) => void;
  children?: JSX.Element;
  zIndex?: number;
  filter?: Filter;
  rotation?: number;
}) {
  const selectedTex = createPixiTexture(() => props.texture);

  return (
    <Show when={selectedTex()}>
      <Suspense>
        <Container
          interactive
          uses={[
            (container) => {
              if(!props.onClick) return;

              function listener(e: FederatedMouseEvent) {
                const newPoint = container.toLocal(e.global);
                props.onClick!(newPoint);
              }

              container.on("pointerdown", listener);
              onCleanup(() => container.off("pointerdown", listener));
            },
            c=>props.filter && (c.filters = [props.filter])
          ]}
        >
          <Sprite
            zIndex={props.zIndex ?? 0}
            pivot={props.pivot ?? { x: 0, y: 0 }}
            texture={selectedTex() ?? Texture.EMPTY}
            scale={props.scale ?? 1}
            rotation={props.rotation ?? 0}
          />
          {props.children}
        </Container>
      </Suspense>
    </Show>
  );
}
