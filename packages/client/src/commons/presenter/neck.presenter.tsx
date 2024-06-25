import {
  For,
  JSX,
  Setter,
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  on,
  onCleanup,
  useContext,
} from "solid-js";
import {
  Texture,
  Sprite as pxSprite,
  Graphics as pxGraphics,
  Container as pxContainer,
  ContainerChild,
} from "pixi.js";
import { getFretDistances } from "~/pages/admin/electric-model-editor/utils/functions/get-fret-distances";
import { Position } from "../interfaces/position";
import { DropShadowFilter } from "pixi-filters";
import {
  Container,
  Graphics,
  RenderedGraphics,
  Sprite,
  useApplication,
} from "solid-pixi";
import { useEditorPageContext } from "../components/editor-page";
import { createPixiTexture } from "../functions/create-texture";
import * as R from "remeda";
import { useViewportContext } from "../components/viewport";
import { useGuitarBodyPresenterContext } from "./guitar-model/electric-model.presenter";
import { Constants } from "~/constants";

const NUT_FROM_FIRST_FRET = 50;
const FRET_DISTANCE = 32.3;

const neckCtx = createContext<{
  setHeadstockMask?: Setter<pxSprite | undefined>;
  childSpawnPos?: Position;
}>();

export function useNeckContext() {
  return useContext(neckCtx);
}

const privateNeckCtx = createContext<{
  setFingerboardMask: Setter<pxContainer<ContainerChild>>;
  isFront: () => boolean | undefined;
  renderedMaskTex: () => Texture | undefined;
  fingerboardHeight: ()=> number;
}>();

export function NeckPresenter(_props: {
  isFront?: () => boolean | undefined;
  position?: Position;
  headstock?: () => JSX.Element;
  nut?: () => JSX.Element;
  wood?: string | undefined;
  fingerboardWood?: string | undefined;
  fretCount?: () => number;
}) {
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const props = mergeProps(
    { isFront: guitarBodyCtx?.isFront ?? (() => true),
      fretCount: () => 24
    },
    _props
  );

  const fretDistance = createMemo(() =>
    getFretDistances(25.5, props.fretCount())
  );

  const fingerboardHeight = createMemo(() => {
    const frets = fretDistance();
    const lastFret = frets[frets.length - 1];
    const lastFretFromFingerboardBottom = 13;
    return lastFret * FRET_DISTANCE + lastFretFromFingerboardBottom + NUT_FROM_FIRST_FRET;
  });

  const [renderedMaskTex, setRenderedMaskTex] = createSignal<Texture>();
  const [headstockMask, setHeadstockMask] = createSignal<pxSprite>();
  const [maskRenderer, setMaskRenderer] = createSignal<pxContainer>();

  const neckWood = createPixiTexture(
    () => props.wood ?? Constants.woodUrl["alder"],
    false
  );
  const fingerboardWood = createPixiTexture(
    () => props.fingerboardWood ?? Constants.woodUrl["rosewood"],
    false
  );

  createEffect(() => {
    props.headstock;
    headstockMask();
    maskRenderer()?.emit("maskUpdated");
  });

  onCleanup(() => {
    guitarBodyCtx?.setNeckTexture(null);
    renderedMaskTex()?.destroy(true);
  });

  return (
    <privateNeckCtx.Provider value={{
      fingerboardHeight : fingerboardHeight,
      isFront: props.isFront,
      renderedMaskTex,
      setFingerboardMask: maskRenderer,
    }}>
      <Container
        zIndex={props.isFront() ? 1.02 : 0.1}
        {...(guitarBodyCtx?.type?.() === "neckThroughConstruction"
          ? {
              position: guitarBodyCtx?.neckPosition() ??
                props.position ?? { x: 0, y: 0 },
            }
          : {})}
      >
        <Fingerboard
          fingerboardWood={fingerboardWood}
          fretDistance={fretDistance}
          nut={props.nut}
        />
        <NeckWoodAndShadow neckWood={neckWood} />
        <TextureRenderer
          setMaskRenderer={setMaskRenderer}
          setRenderedMaskTex={setRenderedMaskTex}
          headstock={props.headstock}
          headstockMask={headstockMask}
        />
        {/* non neckTrough headstock */}
        <Show
          when={props.headstock && guitarBodyCtx?.type?.() !== "neckThroughConstruction"}
        >
          <neckCtx.Provider
            value={{
              setHeadstockMask,
              childSpawnPos: { x: 0, y: -fingerboardHeight() },
            }}
          >
            {props.headstock?.()}
          </neckCtx.Provider>
        </Show>
      </Container>
       {/* neckTrough headstock */}
      <Show
        when={props.headstock && guitarBodyCtx?.type?.() === "neckThroughConstruction"}
      >
        <neckCtx.Provider
          value={{
            setHeadstockMask,
            childSpawnPos: {
              x: guitarBodyCtx!.neckPosition()?.x ?? 0,
              y: -fingerboardHeight() + (guitarBodyCtx!.neckPosition()?.y ?? 0),
            },
          }}
        >
          {props.headstock?.()}
        </neckCtx.Provider>
      </Show>
    </privateNeckCtx.Provider>
  );
}

function FingerboardBackShadow() {
  const privateCtx = useContext(privateNeckCtx)!;
  return (
    <>
      <Graphics
        draw={[
          ["moveTo", 39, 0],
          ["lineTo", 30, -privateCtx.fingerboardHeight()],
          ["lineTo", 50, -privateCtx.fingerboardHeight()],
          ["lineTo", 50, 0],
          ["fill", { color: 0xffffff }],
        ]}
        uses={(g) =>
          (g.filters = [
            new DropShadowFilter({
              blur: 4,
              offset: { x: 0, y: 4 },
              alpha: 0.5,
              shadowOnly: true,
            }),
          ])
        }
        zIndex={2}
      />
      <Graphics
        draw={[
          ["moveTo", -39, 0],
          ["lineTo", -30, -privateCtx.fingerboardHeight()],
          ["lineTo", -50, -privateCtx.fingerboardHeight()],
          ["lineTo", -50, 0],
          ["fill", { color: 0xffffff }],
        ]}
        uses={(g) =>
          (g.filters = [
            new DropShadowFilter({
              blur: 4,
              offset: { x: 0, y: 4 },
              alpha: 0.5,
              shadowOnly: true,
            }),
          ])
        }
        zIndex={1}
      />
    </>
  );
}

function Fingerboard(props: {
  fingerboardWood: () => Texture | undefined;
  nut?: () => JSX.Element;
  fretDistance: () => number[];
}) {
  const [fingerboardMask, setFingerboardMask] = createSignal<pxSprite>();
  const privateCtx = useContext(privateNeckCtx)!;
  const bodyCtx = useGuitarBodyPresenterContext();
  return (
    <Show when={privateCtx.isFront()}>
      {/* fingerboard texture */}
      <Container
        uses={(c) =>
          (c.filters = [
            new DropShadowFilter({
              blur: 4,
              offset: { x: 0, y: 4 },
              alpha: 0.2,
            }),
          ])
        }
        zIndex={privateCtx.isFront() ? 2 : 1}
      >
        <Container mask={fingerboardMask()}>
          <Sprite
            texture={props.fingerboardWood() ?? Texture.EMPTY}
            anchor={{ x: 0.5, y: 1 }}
            height={privateCtx.renderedMaskTex()?.height ?? 668}
          />
          <neckCtx.Provider
            value={{ childSpawnPos: { x: 0, y: -privateCtx.fingerboardHeight() } }}
          >
            <Container y={-privateCtx.fingerboardHeight()}>{props.nut?.()}</Container>
          </neckCtx.Provider>
        </Container>
      </Container>
      <RenderedGraphics
        uses={setFingerboardMask}
        alpha={0}
        anchor={{ x: 0.5, y: 1 }}
        draw={[
          ["moveTo", -38, 0],
          ["lineTo", 38, 0],
          ["lineTo", 30, -privateCtx.fingerboardHeight()],
          ["lineTo", -30, -privateCtx.fingerboardHeight()],
          ["fill", { color: 0xffffff }],
        ]}
      />
      <Show when={privateCtx.isFront() && !bodyCtx?.isElectric()}>
        <Graphics
          zIndex={2.1}
          draw={[
            ['circle', 0, 45, 60],
            ['fill', { color: 0x000000 }],
          ]}
        />
      </Show>
      <Frets distancesFromNut={props.fretDistance()} />
    </Show>
  );
}

function NeckWoodAndShadow(props: { neckWood: () => Texture | undefined }) {
  const privateCtx = useContext(privateNeckCtx)!;
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const [neckMask, setNeckMask] = createSignal<pxSprite>();
  return (
    <Container zIndex={1} mask={neckMask()}>
      <Show when={guitarBodyCtx?.type?.() !== "neckThroughConstruction"}>
        <Sprite
          texture={props.neckWood() ?? Texture.EMPTY}
          anchor={{ x: 0.5, y: 1 }}
          height={privateCtx.renderedMaskTex()?.height ?? 668}
          zIndex={1}
        />
      </Show>

      <Sprite
        anchor={{ x: 0.5, y: 1 }}
        texture={privateCtx.renderedMaskTex() ?? Texture.EMPTY}
        uses={setNeckMask}
      />

      {/* when facing back */}
      <Show when={!privateCtx.isFront()}>
        <FingerboardBackShadow />
      </Show>
    </Container>
  );
}

function Frets(props: { distancesFromNut: number[] }) {
  const viewportCtx = useViewportContext();
  const privateCtx = useContext(privateNeckCtx)!;
  return (
    <For each={props.distancesFromNut}>
      {(d, i) => (
        <Sprite
          zIndex={2}
          anchor={0.5}
          scale={{
            x: 0.49 + Math.log(i() + 1) * 0.035,
            y: 0.49,
          }}
          position={{ x: 0, y: -privateCtx.fingerboardHeight() + NUT_FROM_FIRST_FRET + d * FRET_DISTANCE }}
          texture={viewportCtx?.textures.fret() ?? Texture.EMPTY}
        />
      )}
    </For>
  );
}

function TextureRenderer(props: {
  setMaskRenderer: Setter<pxContainer | undefined>;
  setRenderedMaskTex: Setter<Texture | undefined>;
  headstock?: () => JSX.Element;
  headstockMask: () => pxSprite | undefined;
}) {
  const privateCtx = useContext(privateNeckCtx)!;
  const app = useApplication();
  const guitarBodyCtx = useGuitarBodyPresenterContext();

  return (
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
                const prev = privateCtx.renderedMaskTex();
                guitarBodyCtx?.setNeckTexture(newTex);
                props.setRenderedMaskTex(newTex);
                prev?.destroy(true);
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
        props.setMaskRenderer,
      ]}
    >
      <RenderedGraphics
        anchor={{ x: 0.5, y: 1 }}
        draw={[
          ["moveTo", -38, 0],
          ["lineTo", 38, 0],
          ["lineTo", 30, -privateCtx.fingerboardHeight()],
          ["lineTo", -30, -privateCtx.fingerboardHeight()],
          ["fill", { color: 0xffffff }],
        ]}
      />
      <Graphics
        alpha={0}
        draw={[
          ["moveTo", -200, 0],
          ["lineTo", 200, 0],
          ["lineTo", 200, -privateCtx.fingerboardHeight()],
          ["lineTo", -200, -privateCtx.fingerboardHeight()],
          ["fill", { color: 0xffffff }],
        ]}
      />
      <Show when={props.headstock}>
        <Show when={props.headstockMask()}>
          <Sprite
            uses={(s) => {
              const listener = () => {
                s.parent.emit("maskUpdated");
                setTimeout(() => s.parent.emit("maskUpdated"), 100);
              };
              s.on("change", listener);
              onCleanup(() => s.off("change", listener));
            }}
            position={{ x: 0, y: -privateCtx.fingerboardHeight() }}
            as={props.headstockMask()}
          />
        </Show>
      </Show>
    </Container>
  );
}
