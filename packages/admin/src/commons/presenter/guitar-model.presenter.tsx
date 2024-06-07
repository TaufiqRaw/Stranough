import {
  Assets,
  FederatedPointerEvent,
  Texture,
  Container as pxContainer,
  Sprite as pxSprite,
} from "pixi.js";
import {
  Accessor,
  For,
  JSX,
  Resource,
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  mergeProps,
  onCleanup,
  useContext,
} from "solid-js";
import { Container, Graphics, Sprite } from "solid-pixi";
import { createContext } from "solid-js";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { Position } from "~/commons/interfaces/position";

interface GuitarBodyPresenterContext {
  guitarBodyMask: Accessor<pxSprite | null>;
  container: Accessor<pxContainer | null>;
}

const GuitarBodyPresenterContext = createContext<GuitarBodyPresenterContext>();
export function useGuitarBodyPresenterContext() {
  return useContext(GuitarBodyPresenterContext);
}

export function GuitarModelPresenter(_props: {
  children?: JSX.Element;
  isFront?: boolean;
  body: {
    defaultMask?: string;
    defaultMaskScale?: number;
    mask?: string;
    backMask?: string;
    frontShadowTexture?: string;
    backShadowTexture?: string;
    frontSpecularTexture?: string;
    backSpecularTexture?: string;
    frontHoleMask?: string;
    scale?: number;
  };
  onGuitarClick?: (e: { x: number; y: number }) => void;
  spawnpoints: {
    fingerboard?: Position;
    bridge?: Position;
    switch?: { x: number | undefined; y: number | undefined; rotation: number };
    jack?: {
      side?: { x: number | undefined; y: number | undefined; rotation: number };
      top?: { x: number | undefined; y: number | undefined; rotation: number };
    };
    pickup?: {
      neck?: Position;
      middle?: Position;
      bridge?: Position;
    };
    knobs?: (Position | undefined)[];
  };
  fingerboard?: () => JSX.Element;
  bridge?: () => JSX.Element;
  switch?: () => JSX.Element;
  jack?: {
    side?: () => JSX.Element;
    top?: () => JSX.Element;
  };
  pickup?: {
    neck?: () => JSX.Element;
    middle?: () => JSX.Element;
    bridge?: () => JSX.Element;
  };
  knobs?: (() => JSX.Element)[];
}) {

  const props = mergeProps({isFront : true}, _props)

  const [guitarBodyMask, setGuitarBodyMask] = createSignal<pxSprite | null>(
    null
  );

  const [container, setContainer] = createSignal<pxContainer | null>(null);

  //TODO: allow custom wood textures
  const [woodTextures] = createResource(async () => {
    return (await Assets.load("/assets/alder.jpg")) as Texture;
  });

  const selectedBodyTexture = {
    defaultMask: createPixiTexture(() => props.body.defaultMask),
    mask: createPixiTexture(() => props.body.mask),
    backMask: createPixiTexture(() => props.body.backMask),
    frontShadowTexture: createPixiTexture(() => props.body.frontShadowTexture),
    backShadowTexture: createPixiTexture(() => props.body.backShadowTexture),
    frontSpecularTexture: createPixiTexture(
      () => props.body.frontSpecularTexture
    ),
    backSpecularTexture: createPixiTexture(
      () => props.body.backSpecularTexture
    ),
    frontHoleMask: createPixiTexture(() => props.body.frontHoleMask),
  };

  // make sure the body texture height is not bigger than the guitar wood height
  // if it is, scale it down using this number, both width and height
  const initialBodyWoodScale = createMemo(() => {
    let res = 1;
    if (props.isFront) {
      if (selectedBodyTexture.mask())
        res =
          (selectedBodyTexture.mask()?.height || 1) /
          (woodTextures()?.height ?? 1);
      else
        res =
          (selectedBodyTexture.defaultMask()?.height || 1) /
          (woodTextures()?.height ?? 1);
    } else {
      if (selectedBodyTexture.backMask())
        res =
          (selectedBodyTexture.backMask()?.height || 1) /
          (woodTextures()?.height ?? 1);
      else if (selectedBodyTexture.mask())
        res =
          (selectedBodyTexture.mask()?.height || 1) /
          (woodTextures()?.height ?? 1);
      else
        res =
          (selectedBodyTexture.defaultMask()?.height || 1) /
          (woodTextures()?.height ?? 1);
    }

    return res;
  });

  return (
    <Container>
      {/* Fill the container for centering pivot*/}
      <Container
        sortableChildren
        interactive
        scale={{ x: props.isFront ? 1 : -1, y: 1}}
        uses={[
          setContainer,
          (container) => {
            const listener = (e: FederatedPointerEvent) => {
              const newPoint = container.toLocal(e.global);
              props.onGuitarClick?.(newPoint);
            };
            container.addListener("click", listener);
            onCleanup(() => {
              container.removeListener("click", listener);
            });
          },
        ]}
      >
        <Container
          zIndex={props.isFront ? 0 : 1}
          mask={guitarBodyMask()}
          scale={
            ((props.isFront
              ? selectedBodyTexture.mask()
                ? props.body.scale
                : props.body.defaultMaskScale
              : selectedBodyTexture.backMask()
                ? props.body.scale
                : props.body.defaultMaskScale
            ) ?? 1)
          }
        >
          <Sprite
            scale={{
              x: initialBodyWoodScale(),
              y: initialBodyWoodScale(),
            }}
            texture={woodTextures() ?? Texture.EMPTY}
            anchor={0.5}
          />
          <Sprite
            texture={
              (props.isFront
                ? selectedBodyTexture.mask()
                : selectedBodyTexture.backMask() 
                  ?? selectedBodyTexture.mask()
              )
              ?? selectedBodyTexture.defaultMask() 
              ?? Texture.EMPTY
            }
            anchor={0.5}
            uses={setGuitarBodyMask}
          />
          <Sprite
            zIndex={2}
            texture={
              (props.isFront
                ? selectedBodyTexture.frontShadowTexture()
                : selectedBodyTexture.backShadowTexture()
              ) ?? Texture.EMPTY
            }
            anchor={0.5}
          />
        </Container>

        <Show when={props.fingerboard && props.spawnpoints.fingerboard}>
          <Container zIndex={props.isFront ? 1 : 0} position={props.spawnpoints.fingerboard}>
            {props.fingerboard!()}
          </Container>
        </Show>

        <Show when={props.bridge && props.spawnpoints.bridge && props.isFront}>
          <Container zIndex={1} position={props.spawnpoints.bridge}>
            {props.bridge!()}
          </Container>
        </Show>

        <Show when={props.switch && props.spawnpoints.switch && props.isFront}>
          <Container
            zIndex={1}
            position={{
              x: props.spawnpoints.switch!.x!,
              y: props.spawnpoints.switch!.y!,
            }}
            rotation={props.spawnpoints.switch!.rotation}
          >
            {props.switch!()}
          </Container>
        </Show>

        <Show when={props.jack?.side && !!props.spawnpoints.jack?.side}>
          <Container
            zIndex={1}
            position={{
              x: props.spawnpoints.jack!.side!.x!,
              y: props.spawnpoints.jack!.side!.y!,
            }}
            rotation={props.spawnpoints.jack!.side!.rotation}
          >
            {props.jack!.side!()}
          </Container>
        </Show>

        <Show when={props.jack?.top && !!props.spawnpoints.jack?.top && props.isFront}>
          <Container
            zIndex={1}
            position={{
              x: props.spawnpoints.jack!.top!.x!,
              y: props.spawnpoints.jack!.top!.y!,
            }}
            rotation={props.spawnpoints.jack!.top!.rotation}
          >
            {props.jack!.top!()}
          </Container>
        </Show>

        <Show when={props.pickup && props.spawnpoints.pickup?.neck && props.isFront}>
          <Container zIndex={1} position={props.spawnpoints.pickup!.neck!}>
            {props.pickup?.neck!()}
          </Container>
        </Show>

        <Show when={props.pickup && props.spawnpoints.pickup?.middle && props.isFront}>
          <Container zIndex={1} position={props.spawnpoints.pickup!.middle!}>
            {props.pickup?.middle!()}
          </Container>
        </Show>

        <Show when={props.pickup && props.spawnpoints.pickup?.bridge && props.isFront}>
          <Container zIndex={1} position={props.spawnpoints.pickup!.bridge!}>
            {props.pickup?.bridge!()}
          </Container>
        </Show>

        <Show when={props.knobs}>
          <For each={props.spawnpoints.knobs}>
          {(knob, i) => <Container zIndex={1} position={knob}>
            {props.knobs?.[i()]?.() ?? <></>}
          </Container>}
          </For>
        </Show>

        <GuitarBodyPresenterContext.Provider
          value={{ guitarBodyMask, container }}
        >
          {props.children}
        </GuitarBodyPresenterContext.Provider>
      </Container>
    </Container>
  );
}
