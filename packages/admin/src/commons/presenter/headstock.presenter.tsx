import {
  Sprite as pxSprite,
  Container as pxContainer,
  FederatedMouseEvent,
  Point,
  Texture,
  Filter,
  GlProgram,
} from "pixi.js";
import {
  For,
  JSX,
  Setter,
  Show,
  Suspense,
  createContext,
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  useContext,
} from "solid-js";
import { Container, Sprite, useParent } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { useNeckContext } from "~/commons/presenter/fingerboard.presenter";
import { useViewportContext } from "~/commons/components/viewport";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { Position, PositionWithRotation } from "~/commons/interfaces/position";
import { useGuitarBodyPresenterContext } from "./guitar-model/guitar-model.presenter";

const headstockCtx = createContext<{
  childSpawnPos?: PositionWithRotation;
}>()

export function useHeadstockContext() {
  return useContext(headstockCtx);
}

// TODO: Use context that provides guitar fingerboard (if this component assigned to fingerboard) instead of using setParentMask
// right now just assume the component assigned in a guitar fingerboard if setParentMask is provided
export function HeadstockPresenter(_props: {
  woodTexture?: string;
  texture?: string;
  frontShadowTexture?: string;
  backShadowTexture?: string;
  pivot?: Position;
  scale?: number;
  onClick?: (e: Point) => void;
  children?: JSX.Element;
  isFront?: ()=>boolean | undefined;
  pegs?: (() => JSX.Element)[];
  pegsSpawnPoint ?: PositionWithRotation[];
}) {
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const props = mergeProps({ isFront: guitarBodyCtx?.isFront ?? (()=>true), pegSpawnPoints : [] }, _props);
  const fingerboardCtx = useNeckContext();
  const viewportCtx = useViewportContext();
  const [maskSprite, setMaskSprite] = createSignal<pxSprite | undefined>();
  const [maskForFingerboard, setMaskForFingerboard] = createSignal<pxSprite | undefined>();
  const selectedTex = {
    mask: createPixiTexture(()=>props.texture),
    frontShadow: createPixiTexture(()=>props.frontShadowTexture),
    backShadow: createPixiTexture(()=>props.backShadowTexture),
    woodTexture : createPixiTexture(()=>props.woodTexture),
  };
  createEffect(()=>{
    props.pivot && props.scale
    maskForFingerboard()?.emit('change')
  })
  onCleanup(()=>{
    fingerboardCtx?.setHeadstockMask?.(undefined)
  })
  return (
      <Suspense>
        <Container
          zIndex={1}
          position={fingerboardCtx?.childSpawnPos ?? { x: 0, y: 0 }}
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
          ]}
        >
          <Show when={fingerboardCtx}>
            <Container>
              <Sprite
                uses={[setMaskForFingerboard, s=>fingerboardCtx?.setHeadstockMask?.(s)]}
                pivot={props.pivot ?? { x: 0, y: 0 }}
                texture={selectedTex.mask() ?? Texture.EMPTY}
                scale={fingerboardCtx ? props.scale ?? 1 : 1}
              />
            </Container>
          </Show>
          <Container
            mask={maskSprite()}
            scale={props.scale ?? 1}
            zIndex={1}
          >
            <Sprite
              uses={[setMaskSprite]}
              pivot={props.pivot ?? { x: 0, y: 0 }}
              texture={selectedTex.mask() ?? Texture.EMPTY}
            />
            <Show when={!fingerboardCtx}>
              <Sprite
                pivot={props.pivot ?? { x: 0, y: 0 }}
                texture={selectedTex.woodTexture() ?? viewportCtx?.textures.defaultWood() ?? Texture.EMPTY}
              />
            </Show>
            <Show when={props.isFront()}>
              <Sprite
                zIndex={1}
                pivot={props.pivot ?? { x: 0, y: 0 }}
                texture={selectedTex.frontShadow() ?? Texture.EMPTY}
              />
            </Show>
            <Show when={!props.isFront()}>
              <Sprite
                zIndex={1}
                pivot={props.pivot ?? { x: 0, y: 0 }}
                texture={selectedTex.backShadow() ?? Texture.EMPTY}
              />
            </Show>
          </Container>
          <Container zIndex={1}>
            {props.children}
          </Container>
        </Container>
        <Show when={props.pegs && props.pegs.length >= props.pegSpawnPoints.length}>
          <For each={props.pegsSpawnPoint}>
            {(pegSp, i) => <headstockCtx.Provider value={{
              childSpawnPos : {
                x : pegSp.x + (fingerboardCtx?.childSpawnPos?.x ?? 0),
                y : pegSp.y + (fingerboardCtx?.childSpawnPos?.y ?? 0),
                rotation : pegSp.rotation,
              },
            }}>
              {props.pegs?.[i()]?.() ?? <></>}
            </headstockCtx.Provider>}
          </For>
        </Show>
      </Suspense>
  )
}