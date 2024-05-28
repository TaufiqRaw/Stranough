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
}) {
  const selectedTex = createPixiTexture(() => props.texture);

  const [container, setContainer] = createSignal<pxContainer>();
  const [sprite, setSprite] = createSignal<pxSprite>();

  return (
    <Show when={selectedTex()}>
      <Suspense>
        <Container
          interactive
          uses={[
            setContainer,
            (container) => {
              if(!props.onClick) return;

              function listener(e: FederatedMouseEvent) {
                const newPoint = container.toLocal(e.global);
                props.onClick!(newPoint);
              }

              container.on("pointerdown", listener);
              onCleanup(() => container.off("pointerdown", listener));
            },
          ]}
        >
          <Sprite
            uses={[setSprite]}
            zIndex={props.zIndex ?? 0}
            pivot={props.pivot ?? { x: 0, y: 0 }}
            texture={selectedTex() ?? Texture.EMPTY}
            scale={props.scale ?? 1}
          />
          {props.children}
        </Container>
      </Suspense>
    </Show>
  );
}
