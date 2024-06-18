import {
  Assets,
  ColorMatrixFilter,
  FederatedPointerEvent,
  Filter,
  GlProgram,
  Texture,
  Container as pxContainer,
  Sprite as pxSprite,
} from "pixi.js";
import {
  Accessor,
  For,
  JSX,
  Resource,
  Setter,
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import { Container, Graphics, Sprite, useApplication } from "solid-pixi";
import { createContext } from "solid-js";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { GuitarModelBodyKeyType } from "~/pages/admin/electric-model-editor/utils/types";
import * as R from "remeda";
import fragment from "~/commons/shader/whiteify.frag?raw";
import vertex from "~/commons/shader/whiteify.vert?raw";
import { AcousticModelPresenterProps, ElecticModelPresenterProps } from "../types";
import { DropShadowFilter } from "pixi-filters";
import { AcousticModelProps } from "stranough-server/dist/entities";
import { GuitarBodyPresenterContext, MaskedBodyPresenter, useGuitarBodyPresenterContext } from "./guitar-model.presenter";

const invertColorFilter = new ColorMatrixFilter();
invertColorFilter.negative(true);

const whiteFilter = new Filter({
  glProgram: new GlProgram({
    fragment, vertex
  }),
});

interface PrivateCtxType { 
  scale: () => number | undefined;
  hasTopWood: () => boolean;
  hasFingerboard: () => boolean;
  textures : {
    neckTexture: Accessor<Texture | null>;
    selectedWoodTexture : Accessor<Texture | undefined>;
    selectedNeckWoodTexture : Accessor<Texture | undefined>;
  }
  woodToBodyScale: () => number;
  fingerboardSP : ()=>Position | undefined;
}


const PrivateCtx = createContext<PrivateCtxType>();

export function AcousticModelPresenter(_props: AcousticModelPresenterProps) {
  const props = mergeProps(
    { isFront: true},
    _props
  );
  const [container, setContainer] = createSignal<pxContainer | null>(null);

  const [neckTexture, setNeckTexture] =
    createSignal<Texture | null>(null);

  const selectedWoodTexture = createPixiTexture(
    () =>
      (props.body.topWood
        ? props.isFront
          ? props.body.topWood
          : props.body.backWood
        : props.body.backWood) ?? Constants.woodUrl["alder"],
    false
  );

  const textures = {
    mask: createPixiTexture(() => props.body.mask),
    shadowTexture: createPixiTexture(() => props.body.shadowTexture),
    pickguardTexture: createPixiTexture(() => props.pickguard?.()),
    specularTexture: createPixiTexture(
      () => props.body.specularTexture
    ),
    neckWood: createPixiTexture(
      () => props.neckWood ?? Constants.woodUrl["alder"],
      false
    ),
  };

  // make sure the body texture height is not bigger than the guitar wood height
  // if it is, scale it down using this number, both width and height
  const woodToBodyScale = createMemo(() => {
    return (textures.mask()?.height ?? 1) / (selectedWoodTexture()?.height ?? 1);
  });

  return (
    <Container>
      <GuitarBodyPresenterContext.Provider
        value={{
          isFront: () => props.isFront,
          setNeckTexture: setNeckTexture,
          neckPosition: () => props.spawnpoints.fingerboard,
          isElectric: () => false,
          selectedMask: textures.mask,
        }}
      >
        <PrivateCtx.Provider
          value={{
            textures : {
              selectedNeckWoodTexture : () => textures.neckWood(),
              neckTexture,
              selectedWoodTexture,
            },
            woodToBodyScale,
            hasTopWood: () => props.body.topWood !== undefined,
            hasFingerboard: () => props.fingerboard !== undefined,
            fingerboardSP : () => props.spawnpoints.fingerboard,
            scale: () => props.body.scale ?? 1,
          }}
        >
        {/* Fill the container for centering pivot*/}
        <Container
          sortableChildren
          interactive
          scale={{ x: props.isFront ? 1 : -1, y: 1 }}
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
          <Body />

          <Show when={props.fingerboard && props.spawnpoints.fingerboard}>
            <Container
              zIndex={props.isFront ? 1.02 : 0}
              position={props.spawnpoints.fingerboard}
            >
              {props.fingerboard!()}
            </Container>
          </Show>

          <Show when={props.colorOverlay}>
            <Container scale={props.body.scale} zIndex={1.01}>{props.colorOverlay!()}</Container>
          </Show>

          <Show when={props.pickguard && textures.pickguardTexture() && textures.mask()}>
            <Container zIndex={1.015} position={{ x: 0, y: 0 }} scale={props.body.scale}>
              <Sprite 
                texture={textures.pickguardTexture() ?? Texture.EMPTY}
                height={textures.mask()?.height}
                width={textures.mask()?.width}
                anchor={0.5}
              />
            </Container>
          </Show>

          <Sprite
            zIndex={2}
            texture={
              textures.shadowTexture() ?? Texture.EMPTY
            }
            anchor={0.5}
            scale={props.body.scale ?? 1}
          />

          <Show
            when={props.bridge && props.spawnpoints.bridge && props.isFront}
          >
            <Container 
              uses={c=>c.filters = [ new DropShadowFilter({
                blur: 2,
                offset: { x: 4, y: 2 },
                alpha: 0.4,
                resolution: 4,
              })]}
              zIndex={1.03} position={props.spawnpoints.bridge}>
              {props.bridge!()}
            </Container>
          </Show>

          <Show when={props.jack && !!props.spawnpoints.jack}>
            <Container
              zIndex={1.02}
              position={{
                x: props.spawnpoints.jack!.x!,
                y: props.spawnpoints.jack!.y!,
              }}
              rotation={props.spawnpoints.jack!.rotation}
            >
              {props.jack!()}
            </Container>
          </Show>
          {props.children}
        </Container>
        </PrivateCtx.Provider>
      </GuitarBodyPresenterContext.Provider>
    </Container>
  );
}

function Body(){
  const model = useGuitarBodyPresenterContext()!;
  const privateCtx = useContext(PrivateCtx)!;

  return <>
    <Container
      zIndex={model.isFront() ? 0 : 1}
      scale={privateCtx.scale() ?? 1}
    >
      <MaskedBodyPresenter>
        {()=><Sprite
          scale={privateCtx.woodToBodyScale() ?? 1}
          texture={privateCtx.textures.selectedWoodTexture() ?? Texture.EMPTY}
          anchor={0.5}
        />}
      </MaskedBodyPresenter>
    </Container>
  </> 
}