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
  Match,
  Setter,
  Show,
  Suspense,
  Switch,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  useContext,
} from "solid-js";
import { Container, Graphics, RenderedGraphics, Sprite, useParent } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { useNeckContext } from "~/commons/presenter/neck.presenter";
import { useViewportContext } from "~/commons/components/viewport";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { PosRotWithFlipped, Position, PositionWithRotation } from "~/commons/interfaces/position";
import { useGuitarBodyPresenterContext } from "./guitar-model/electric-model.presenter";
import { HeadstockPresenterProps } from "./types";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderRegisterStringSpawnpoints } from "~/pages/guitar-builder/presenter/guitar-builder-string-presenter";
import { Constants } from "~/constants";

const headstockCtx = createContext<{
  childSpawnPos?: PositionWithRotation;
  slottedRodOffset?: ()=>number | undefined;
  flipped?: ()=>boolean | undefined;
}>()

export function useHeadstockContext() {
  return useContext(headstockCtx);
}

// TODO: Use context that provides guitar fingerboard (if this component assigned to fingerboard) instead of using setParentMask
// right now just assume the component assigned in a guitar fingerboard if setParentMask is provided
export function HeadstockPresenter(_props: HeadstockPresenterProps) {
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const guitarBuilderCtx = useGuitarBuilderContext();
  const props = mergeProps({ isFront: guitarBodyCtx?.isFront ?? (()=>true), pegsSpawnPoint : [] as PosRotWithFlipped[] }, _props);
  const fingerboardCtx = useNeckContext();
  const viewportCtx = useViewportContext();
  const [maskSprite, setMaskSprite] = createSignal<pxSprite | undefined>();
  const [maskForFingerboard, setMaskForFingerboard] = createSignal<pxSprite | undefined>();
  const selectedTex = {
    mask: createPixiTexture(()=>props.texture),
    frontShadow: createPixiTexture(()=>props.frontShadowTexture),
    backShadow: createPixiTexture(()=>props.backShadowTexture),
    neckWoodTexture : createPixiTexture(()=>props.neckWoodTexture),
  };
  const woodTexture = createMemo(()=>selectedTex.neckWoodTexture() ?? fingerboardCtx?.neckWoodTexture?.() ?? viewportCtx?.textures.defaultWood() ?? Texture.EMPTY);
  const selectedOverlay = createMemo(()=>guitarBuilderCtx?.electric.headstockOverlay.get());
  const overlayTexture = createPixiTexture(()=>selectedOverlay() === 'rosewood' ? Constants.woodUrl.rosewood : selectedOverlay() === 'plain-maple' ? Constants.woodUrl["plain-maple"] : undefined, false);
  const woodToMaskScale = createMemo(()=>(selectedTex.mask()?.height ?? 0) / (woodTexture()?.height ?? 1))

  createEffect(()=>{
    props.pivot && props.scale
    maskForFingerboard()?.emit('change')
  })
  onCleanup(()=>{
    fingerboardCtx?.setHeadstockMask?.(undefined)
  })
  return (
      <>
        <Container
          zIndex={1}
          position={fingerboardCtx?.childSpawnPos?.() ?? { x: 0, y: 0 }}
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
            <Show when={props.isFront()}>
              <Show when={
                !!selectedOverlay()
              }>
                <Switch>
                  <Match when={selectedOverlay() === 'plain-maple' || selectedOverlay() === 'rosewood'}>
                    <Sprite
                      texture={overlayTexture() ?? Texture.EMPTY}
                      scale={woodToMaskScale()}
                      zIndex={0.6}
                      position={{
                        x : -(props.pivot?.x ?? 0),
                        y : -(props.pivot?.y ?? 0)
                      }}
                    />
                  </Match>
                  <Match when={selectedOverlay() === 'pvc'}>
                    <RenderedGraphics
                      zIndex={0.6}
                      draw={[
                        ['rect', 0, 0, selectedTex.mask()?.width ?? 0, selectedTex.mask()?.height ?? 0],
                        ['fill', 0xE5E5E5],
                      ]}
                      position={{
                        x : -(props.pivot?.x ?? 0),
                        y : -(props.pivot?.y ?? 0)
                      }}
                    />
                  </Match>
                  <Match when={selectedOverlay() === 'pvc-black'}>
                    <RenderedGraphics
                      zIndex={0.6}
                      draw={[
                        ['rect', 0, 0, selectedTex.mask()?.width ?? 0, selectedTex.mask()?.height ?? 0],
                        ['fill', 0x000000],
                      ]}
                      position={{
                        x : -(props.pivot?.x ?? 0),
                        y : -(props.pivot?.y ?? 0)
                      }}
                    />
                  </Match>
                </Switch>
              </Show>
              <Sprite
                texture={woodTexture()}
                scale={woodToMaskScale()}
                zIndex={0.5}
                position={{
                  x : -(props.pivot?.x ?? 0),
                  y : -(props.pivot?.y ?? 0)
                }}
              />
              <Sprite
                zIndex={1}
                texture={selectedTex.frontShadow() ?? Texture.EMPTY}
              />
            </Show>
            <Show when={!props.isFront()}>
              <Sprite
                zIndex={1}
                texture={selectedTex.backShadow() ?? Texture.EMPTY}
              />
              <Show when={!fingerboardCtx}>
                <Graphics
                  draw={[
                    ['rect', 0, 0, selectedTex.mask()?.width ?? 0, selectedTex.mask()?.height ?? 0],
                    ['fill', 0xff0000]
                  ]}
                />
                <Sprite
                  position={{
                    x : -(props.pivot?.x ?? 0),
                    y : -(props.pivot?.y ?? 0)
                  }}
                  texture={woodTexture()}
                  scale={woodToMaskScale()}
                />
              </Show>
            </Show>
          </Container>
          <Container zIndex={1}>
            {props.children}
          </Container>
        </Container>
        <Show when={props.pegs && props.pegs.length >= props.pegsSpawnPoint.length}>
          <For each={props.pegsSpawnPoint}>
            {(pegSp, i) => <headstockCtx.Provider value={{
              childSpawnPos : {
                x : pegSp.x + (fingerboardCtx?.childSpawnPos?.()?.x ?? 0),
                y : pegSp.y + (fingerboardCtx?.childSpawnPos?.()?.y ?? 0),
                rotation : pegSp.rotation,
              },
              slottedRodOffset : props.slottedRodOffset,
              flipped : ()=>pegSp.flipped,
            }}>
              {props.pegs?.[i()]?.() ?? <></>}
            </headstockCtx.Provider>}
          </For>
        </Show>
        <GuitarBuilderRegisterStringSpawnpoints spawnpoints={()=>props.pegsSpawnPoint.map(el=>(
          props.isSlotted?.() 
            ? { x: el.x + (fingerboardCtx?.childSpawnPos?.()?.x ?? 0) + (
              ((props.slottedRodOffset?.() ?? 0) + 10) * (el.flipped ? -1 : 1) 
            ), y: el.y + (fingerboardCtx?.childSpawnPos?.()?.y ?? 0) }
            : { x: el.x + (fingerboardCtx?.childSpawnPos?.()?.x ?? 0), y: el.y + (fingerboardCtx?.childSpawnPos?.()?.y ?? 0) }
        ))} type="headstock"/>
      </>
  )
}