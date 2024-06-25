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
import * as R from "remeda";
import fragment from "~/commons/shader/whiteify.frag?raw";
import vertex from "~/commons/shader/whiteify.vert?raw";
import { ElecticModelPresenterProps } from "../types";
import { DropShadowFilter } from "pixi-filters";
import {ElectricModel as ElectricModelConfig} from 'stranough-common'

const invertColorFilter = new ColorMatrixFilter();
invertColorFilter.negative(true);

const whiteFilter = new Filter({
  glProgram: new GlProgram({
    fragment, vertex
  }),
});

interface GuitarBodyPresenterContext {
  neckPosition: () => Position | undefined;
  setNeckTexture: Setter<Texture | null>;
  isFront: () => boolean;
  type?: () => typeof ElectricModelConfig.constructionKeys[number] | undefined;
  isElectric: () => boolean;
  selectedMask : Accessor<Texture | undefined>;
  backWoodTexture?: Accessor<Texture | undefined>;
}

interface PrivateCtxType { 
  container: Accessor<pxContainer | null>;
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

export const GuitarBodyPresenterContext = createContext<GuitarBodyPresenterContext>();
export function useGuitarBodyPresenterContext() {
  return useContext(GuitarBodyPresenterContext);
}

const PrivateCtx = createContext<PrivateCtxType>();

export function ElectricModelPresenter(_props: ElecticModelPresenterProps) {
  const props = mergeProps(
    { isFront: true, body: { type: "boltOnBody" } },
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
          : props.body.coreWood
        : props.body.coreWood) ?? Constants.woodUrl["alder"],
    false
  );

  const textures = {
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
    neckWood: createPixiTexture(
      () => props.neckWood ?? Constants.woodUrl["alder"],
      false
    ),
  };

  const selectedMask = createMemo(() =>
    props.isFront
      ? textures.mask()
      : textures.backMask() ?? textures.mask()
  );

  // make sure the body texture height is not bigger than the guitar wood height
  // if it is, scale it down using this number, both width and height
  const woodToBodyScale = createMemo(() => {
    return (selectedMask()?.height ?? 1) / (selectedWoodTexture()?.height ?? 1);
  });

  return (
    <Container>
      <GuitarBodyPresenterContext.Provider
        value={{
          isFront: () => props.isFront,
          type: () => props.body.type,
          setNeckTexture: setNeckTexture,
          neckPosition: () => props.spawnpoints.fingerboard,
          isElectric: () => true,
          selectedMask,
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
            scale: () => props.body.scale,
            container,
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

          <Show when={props.colorOverlay}>
            <Container scale={props.body.scale} zIndex={1.01}>{props.colorOverlay!()}</Container>
          </Show>

          <Sprite
            zIndex={2}
            texture={
              (props.isFront
                ? textures.frontShadowTexture()
                : textures.backShadowTexture()) ?? Texture.EMPTY
            }
            anchor={0.5}
            scale={props.body.scale ?? 1}
          />

          <Show when={props.fingerboard && props.spawnpoints.fingerboard}>
            <Show
              when={props.body.type !== "neckThroughConstruction"}
              fallback={props.fingerboard!()}
            >
              <Container
                zIndex={props.isFront ? 1.02 : 0}
                position={props.spawnpoints.fingerboard}
              >
                {props.fingerboard!()}
              </Container>
            </Show>
          </Show>

          <Show when={props.jack?.side && !!props.spawnpoints.jack?.side}>
            <Container
              zIndex={1.02}
              position={{
                x: props.spawnpoints.jack!.side!.x!,
                y: props.spawnpoints.jack!.side!.y!,
              }}
              rotation={props.spawnpoints.jack!.side!.rotation}
            >
              {props.jack!.side!()}
            </Container>
          </Show>

          {/* Front Facing Components */}
          <Show when={props.isFront}>
            <Show
              when={
                props.jack?.top && !!props.spawnpoints.jack?.top
              }
            >
              <Container
                zIndex={1.02}
                position={{
                  x: props.spawnpoints.jack!.top!.x!,
                  y: props.spawnpoints.jack!.top!.y!,
                }}
                rotation={props.spawnpoints.jack!.top!.rotation}
              >
                {props.jack!.top!()}
              </Container>
            </Show>

            <Show when={props.pickguard && props.spawnpoints.pickguard}>
              <Container zIndex={1.015} position={props.spawnpoints.pickguard} scale={props.body.scale}>
                {props.pickguard!()}
              </Container>
            </Show>

            <Show
              when={props.bridge && props.spawnpoints.bridge}
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

            <Show
              when={props.switch && props.spawnpoints.switch}
            >
              <Container
                zIndex={1.02}
                position={{
                  x: props.spawnpoints.switch!.x!,
                  y: props.spawnpoints.switch!.y!,
                }}
                rotation={props.spawnpoints.switch!.rotation}
              >
                {props.switch!()}
              </Container>
            </Show>
            
            <Show
              when={
                props.pickup && props.pickup.items[0] && (props.pickup.type?.length ?? 0) > 1 && props.spawnpoints.pickup?.neck
              }
            >
              <Container zIndex={1.02} position={props.spawnpoints.pickup!.neck!}>
                {props.pickup?.items[0]?.()}
              </Container>
            </Show>

            <Show
              when={
                (props.pickup && props.pickup.items[0] && (props.pickup.type?.length ?? 0) == 1)
                || (props.pickup && props.pickup.items[1] && (props.pickup.type?.length ?? 0) == 2)
              }
            >
              <Container zIndex={1.02} position={props.spawnpoints.pickup!.middle!}>
                <Show when={props.pickup && props.pickup.items[0] && (props.pickup.type?.length ?? 0) == 1}>
                  {props.pickup?.items[0]!()}
                </Show>
                <Show when={props.pickup && props.pickup.items[1] && (props.pickup.type?.length ?? 0) == 3}>
                  {props.pickup?.items[1]!()}
                </Show>
              </Container>
            </Show>

            <Show
              when={
                (props.pickup && props.pickup.items[1] && (props.pickup.type?.length ?? 0) == 2)
                || (props.pickup && props.pickup.items[2] && (props.pickup.type?.length ?? 0) == 3)
              }
            >
              <Container zIndex={1.02} position={props.spawnpoints.pickup!.bridge!}>
                <Show when={props.pickup && props.pickup.items[1] && (props.pickup.type?.length ?? 0) == 2}>
                  {props.pickup?.items[1]!()}
                </Show>
                <Show when={props.pickup && props.pickup.items[2] && (props.pickup.type?.length ?? 0) == 3}>
                  {props.pickup?.items[2]!()}
                </Show>
              </Container>
            </Show>

            <Show when={props.knobs}>
              <For each={props.spawnpoints.knobs}>
                {(knob, i) => (
                  <Container zIndex={1.02} position={knob}>
                    {props.knobs?.[i()]?.() ?? <></>}
                  </Container>
                )}
              </For>
            </Show>
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
    <NeckThroughBody/>
  </> 
}

export function MaskedBodyPresenter(props : {
  children : ((m : Accessor<pxSprite | null>)=>JSX.Element);
}){
  const [guitarBodyMask, setGuitarBodyMask] = createSignal<pxSprite | null>(
    null
  );

  const model = useGuitarBodyPresenterContext()!;
  const privateCtx = useContext(PrivateCtx)!;


  // hacks to make sure the mask is updated
  createEffect(()=>model.type?.());
  
  return <Container
    mask={guitarBodyMask()}
  >
    {props.children(guitarBodyMask)}
    <Sprite
      texture={model.selectedMask() ?? Texture.EMPTY}
      anchor={0.5}
      uses={setGuitarBodyMask}
    />
  </Container>
}

function NeckThroughBody(props : {}){
  const model = useGuitarBodyPresenterContext()!;

  return <>
    <Show when={model.type!() === "neckThroughConstruction"}>
      <NeckThroughBodyWithNeck/>
      <NeckThroughBodyNoNeck/>
      <NeckThroughTopWood/>
    </Show>
  </>
}

function NeckThroughBodyNoNeck(
  props : {
  }
){
  const model = useGuitarBodyPresenterContext()!;
  const privateCtx = useContext(PrivateCtx)!;
  const app = useApplication();

  const [maskSprite, setMaskSprite] = createSignal<pxSprite | null>(null);  
  return <Show when={!privateCtx.hasFingerboard()}>
    <Container
      zIndex={model.isFront() ? 0 : 1}
      scale={privateCtx.scale() ?? 1}
      mask={maskSprite()}
    >
      <Show when={maskSprite()}>
        <Sprite
          texture={privateCtx.textures.selectedWoodTexture() ?? Texture.EMPTY}
          anchor={0.5}
          scale={privateCtx.woodToBodyScale() ?? 1}
        />
      </Show>
      <Sprite
        uses={[
          (s) => {
            const listener = (tex: Texture) => {
              console.log(tex);
              s.texture = tex;
            };
            s.parent.addListener("textureGenerated", listener);
            onCleanup(() =>
              s.parent.removeListener("textureGenerated", listener)
            );
          },
          setMaskSprite,
        ]}
        anchor={0.5}
        texture={Texture.EMPTY}
      />
      <Container>
        <Sprite
          uses={[
            (s) => {
              onMount(() => {
                s.alpha = 1;
                s.filters = [invertColorFilter];
                const mask = app?.renderer.generateTexture({
                  target: s.parent,
                });
                if (mask) {
                  s.parent.parent.emit("textureGenerated", mask);
                }
                s.alpha = 0;
              });
            },
          ]}
          texture={model.selectedMask() ?? Texture.EMPTY}
          anchor={0.5}
          zIndex={0}
        />
      </Container>
    </Container>
  </Show>
}

function NeckThroughBodyWithNeck(props : {
}){
  const model = useGuitarBodyPresenterContext()!;
  const app = useApplication();
  const privateCtx = useContext(PrivateCtx)!;

  const [renderedNeckThroughMask, setRenderedNeckThroughMask] =
    createSignal<Texture | null>(null);
  const [neckThroughMaskSprite, setNeckThroughMaskSprite] =
    createSignal<pxSprite | null>(null);
  
  createEffect(() => {
    privateCtx.textures.neckTexture();
    neckThroughMaskSprite();
    privateCtx.scale();
    neckThroughMaskSprite()?.emit("change");
  });

  return <Show when={privateCtx.hasFingerboard() && privateCtx.textures.neckTexture()}>
  <Container
    uses={[
      (c) => {
        const debouncer = R.debounce(
          (_: any) => {
            c.alpha = 1;
            const newTex = app?.renderer.generateTexture({
              antialias: true,
              target: c,
            });
            if (newTex) {
              //TODO : find safest way to destroy previous texture
              setRenderedNeckThroughMask(newTex);
            }
            c.alpha = 0;
          },
          { waitMs: 5 }
        );

        const listener = (args: any) => debouncer.call(args);
        c.on("textureGenerated", listener);
        c.on("maskUpdated", listener);
        onCleanup(() => c.off("maskUpdated", listener));
        onCleanup(() => c.off("textureGenerated", listener));
      },
    ]}
  >
    <Show when={privateCtx.textures.neckTexture()}>
      <Sprite
        anchor={{ x: 0.5, y: 1 }}
        position={privateCtx.fingerboardSP()}
        texture={privateCtx.textures.neckTexture() ?? Texture.EMPTY}
      />
    </Show>
    <Show when={model.selectedMask()}>
      <Sprite
        uses={[
          setNeckThroughMaskSprite,
          (s) => (s.filters = [invertColorFilter]),
          (s) => {
            const listener = () => {
              s.parent.emit("maskUpdated");
              setTimeout(() => s.parent.emit("maskUpdated"), 100);
            };
            s.on("change", listener);
            onCleanup(() => s.off("change", listener));
          },
        ]}
        texture={model.selectedMask() ?? Texture.EMPTY}
        anchor={0.5}
        zIndex={0}
        scale={privateCtx.scale() ?? 1}
      />
    </Show>
  </Container>
  <NeckThroughBodyWithNeckWood renderedNeckThroughMask={renderedNeckThroughMask}/>
</Show>}

function NeckThroughBodyWithNeckWood(props : {
  renderedNeckThroughMask : ()=>Texture | null;
}){
  const model = useGuitarBodyPresenterContext()!;
  const [maskSprite, setMaskSprite] = createSignal<pxSprite | null>(null);
  const privateCtx = useContext(PrivateCtx)!;

  const selectedMaskHeight = createMemo(() => {
    return model.selectedMask()?.height;
  })

  const woodToBodyScale = createMemo(() => {
    return (props.renderedNeckThroughMask()?.height ?? 1) / (privateCtx.textures.selectedNeckWoodTexture()?.height ?? 1);
  });
  return <Show when={privateCtx.textures.neckTexture()}>
    <Container
      zIndex={model.isFront() ? 1 : 0}
      mask={maskSprite()}
      position={{
        x: 0,
        y:
          ((selectedMaskHeight() ?? 0) *
            (privateCtx.scale() ?? 1)) /
          2,
      }}
    >
      <Show when={props.renderedNeckThroughMask()}>
        <Sprite
          uses={setMaskSprite}
          texture={props.renderedNeckThroughMask() ?? Texture.EMPTY}
          anchor={{ x: 0.5, y: 1 }}
        />
        <Sprite
          texture={privateCtx.textures.selectedNeckWoodTexture() ?? Texture.EMPTY}
          anchor={{ x: 0.5, y: 1 }}
          scale={woodToBodyScale() ?? 1}
        />
      </Show>
    </Container>
    <NeckThroughTopWood/>
  </Show>
}

function NeckThroughTopWood(props: {}){
  const model = useGuitarBodyPresenterContext()!;
  const app = useApplication();
  const privateCtx = useContext(PrivateCtx)!;
  return <Show when={model.isFront() && privateCtx.hasTopWood()}>
  <Container
  zIndex={1}
  scale={privateCtx.scale() ?? 1}>
    <NeckThroughToFullMaskedPresenter>
      {()=><Sprite
        scale={privateCtx.woodToBodyScale() ?? 1}
        zIndex={1}
        texture={privateCtx.textures.selectedWoodTexture() ?? Texture.EMPTY}
        anchor={0.5}
      />}
    </NeckThroughToFullMaskedPresenter>
  </Container>
</Show>
}

export function NeckThroughToFullMaskedPresenter(props : {
  children : ((m : Accessor<pxSprite | null>)=>JSX.Element);
}){
  const model = useGuitarBodyPresenterContext()!;
  const app = useApplication();
  const privateCtx = useContext(PrivateCtx)!;
  const [mask, setMask] = createSignal<pxSprite | null>(null);
  return <Container>
    <Container zIndex={1}>
    {props.children(mask)}
    </Container>
    <Sprite
      uses={[
        (s) => {
          const listener = (tex: Texture) => {
            s.texture = tex;
            s.parent.mask = s;
            s.parent.removeListener(
              "textureGenerated",
              listener
            );
            setMask(s);
          };
          s.parent.addListener("textureGenerated", listener);
        },
      ]}
      anchor={0.5}
      texture={Texture.EMPTY}
    />
    <Container>
      <Sprite
        uses={[
          (s) => {
            onMount(() => {
              s.alpha = 1;
              s.filters = [whiteFilter];
              const mask = app?.renderer.generateTexture({
                target: s.parent,
              });
              if (mask) {
                s.parent.parent.emit("textureGenerated", mask);
              }
              s.alpha = 0;
            });
          },
        ]}
        texture={model.selectedMask() ?? Texture.EMPTY}
        anchor={0.5}
      />
    </Container>
  </Container>
}