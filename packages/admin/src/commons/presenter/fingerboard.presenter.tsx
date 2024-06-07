import { For, JSX, Setter, Show, createContext, createEffect, createSignal, mergeProps, on, onCleanup, useContext } from "solid-js";
import { Texture, Sprite as pxSprite, Graphics as pxGraphics, Container as pxContainer} from "pixi.js";
import { getFretDistances } from "~/pages/admin/model-editor/utils/functions/get-fret-distances";
import { Position } from "../interfaces/position";
import { DropShadowFilter } from "pixi-filters";
import { Container, Graphics, RenderedGraphics, Sprite, useApplication } from "solid-pixi";
import { useEditorPageContext } from "../components/editor-page";
import { createPixiTexture } from "../functions/create-texture";
import * as R from 'remeda'
import { useViewportContext } from "../components/viewport";

const FINGERBOARD_TOP = -668;

const fingerboardCtx = createContext<{
  setHeadstockMask ?: Setter<pxSprite | undefined>,
  childSpawnPos ?: Position,
}>();

export function useFingerboardContext(){
  return useContext(fingerboardCtx);
}

//TODO : Use context that provides guitar model (if available)
export function FingerboardPresenter(_props : {
  isFront ?: boolean,
  position ?: Position,
  headstock ?: ()=> JSX.Element,
  nut ?: ()=> JSX.Element,
  woodTextures ?: () => pxSprite
}) {
  const props = mergeProps({isFront: true}, _props);
  const fretDistance = getFretDistances(25.5, 24);
  const app = useApplication();
  const viewportCtx = useViewportContext();

  const [guitarNeckMask, setNeckMask] = createSignal<pxSprite>();
  const [renderedMaskTex, setRenderedMaskTex] = createSignal<Texture>();
  const [headstockMask, setHeadstockMask] = createSignal<pxSprite>();
  const [fingerboardMask, setFingerboardMask] = createSignal<pxSprite>();
  const [maskRenderer, setMaskRenderer] = createSignal<pxContainer>();

  createEffect(()=>{
    props.headstock;
    headstockMask();
    maskRenderer()?.emit("maskUpdated")
  })

  return (
    <Container
      position={props.position ?? { x: 0, y: 0 }}
    >
      {/* Show When Facing front */}
      <Show when={props.isFront}>
        {/* fingerboard texture */}
        <Container 
          uses={c=>c.filters = [ new DropShadowFilter({
            blur: 4,
            offset: { x: 0, y: 4 },
            alpha: 0.2,
          })]}
          zIndex={props.isFront ? 2 : 1}
        >
          <Container mask={fingerboardMask()}>
            <Sprite
              texture={viewportCtx?.textures.defaultWood()}
              anchor={{ x: 0.5, y: 1 }}
              height={renderedMaskTex()?.height ?? 668}
            />
            <fingerboardCtx.Provider value={{childSpawnPos : {x: 0, y: FINGERBOARD_TOP}}}>
              <Container y={FINGERBOARD_TOP}>
                {props.nut?.()}
              </Container>
            </fingerboardCtx.Provider>
          </Container>
        </Container>
        <RenderedGraphics
            uses={setFingerboardMask}
            alpha={0}
            anchor={{ x: 0.5, y: 1 }}
            draw={[
              ["moveTo", -38, 0],
              ["lineTo", 38, 0],
              ["lineTo", 30, FINGERBOARD_TOP],
              ["lineTo", -30, FINGERBOARD_TOP],
              ["fill", { color: 0xffffff }],
            ]}
          />
        <Frets distancesFromNut={fretDistance}/>
      </Show>

      <Container zIndex={1} mask={guitarNeckMask()}>
        <Sprite
          texture={viewportCtx?.textures.defaultWood()}
          anchor={{ x: 0.5, y: 1 }}
          height={renderedMaskTex()?.height ?? 668}
          zIndex={1}
        />

        <Sprite
          anchor={{ x: 0.5, y: 1 }}
          texture={renderedMaskTex() ?? Texture.EMPTY} 
          uses={setNeckMask}
          
        />

        {/* when facing back */}
        <Show when={!props.isFront}>
          <FingerboardBackShadow />
        </Show>

      </Container>
      <Show when={props.headstock}>
        <fingerboardCtx.Provider value={{setHeadstockMask, childSpawnPos : {x: 0, y: FINGERBOARD_TOP}}}>
          {props.headstock?.()}
        </fingerboardCtx.Provider>
      </Show>
      <Container 
        uses={[c=>{
          const debouncer = R.debounce((_: any)=>{
            c.alpha = 1;
            const newTex = app?.renderer.generateTexture({antialias : true, target : c});
            if(newTex){
              const prev = renderedMaskTex();
              setRenderedMaskTex(newTex);
              prev?.destroy(true);
            }
            c.alpha = 0;
          }, {waitMs : 5});

          const listener = (args : any)=>debouncer.call(args);
          c.on("textureGenerated", listener);
          c.on("maskUpdated", listener);
          onCleanup(()=>c.off("maskUpdated", listener))
          onCleanup(()=>c.off("textureGenerated", listener))
        }, setMaskRenderer]}>
          <RenderedGraphics
            anchor={{ x: 0.5, y: 1 }}
            draw={[
              ["moveTo", -38, 0],
              ["lineTo", 38, 0],
              ["lineTo", 30, FINGERBOARD_TOP],
              ["lineTo", -30, FINGERBOARD_TOP],
              ["fill", { color: 0xffffff }],
            ]}
          />
          <Graphics
            alpha={0}
            draw={[
              ["moveTo", -200, 0],
              ["lineTo", 200, 0],
              ["lineTo", 200, FINGERBOARD_TOP],
              ["lineTo", -200, FINGERBOARD_TOP],
              ["fill", { color: 0xffffff }],
            ]}
          />
          <Show when={props.headstock}>
            <Show when={headstockMask()}>
              <Sprite
                uses={s=>{
                  const listener = ()=>{s.parent.emit("maskUpdated"); setTimeout(()=>s.parent.emit("maskUpdated"), 100)};
                  s.on("change", listener);
                  onCleanup(()=>s.off("change", listener))
                }}
                position={{ x: 0, y: FINGERBOARD_TOP }}
                as={headstockMask()}
              />
            </Show>
          </Show>
      </Container>
    </Container>
  );
}

function FingerboardBackShadow(){
  return <><Graphics
    draw={[
      ["moveTo", 39, 0],
      ["lineTo", 30, FINGERBOARD_TOP],
      ["lineTo", 50, FINGERBOARD_TOP],
      ["lineTo", 50, 0],
      ["fill", { color: 0xffffff }],
    ]}
    uses={g=>g.filters = [new DropShadowFilter({
      blur: 4,
      offset: { x: 0, y: 4 },
      alpha: 0.5,
      shadowOnly: true
    })]}
    zIndex={1}
  />
  <Graphics
    draw={[
      ["moveTo", -39, 0],
      ["lineTo", -30, FINGERBOARD_TOP],
      ["lineTo", -50, FINGERBOARD_TOP],
      ["lineTo", -50, 0],
      ["fill", { color: 0xffffff }],
    ]}
    uses={g=>g.filters = [new DropShadowFilter({
      blur: 4,
      offset: { x: 0, y: 4 },
      alpha: 0.5,
      shadowOnly: true
    })]}
    zIndex={1}
  />
  </>
}

function Frets(props : {
  distancesFromNut : number[]
}){
  const viewportCtx = useViewportContext();
  return <For each={props.distancesFromNut}>
    {(d,i)=><Sprite
      zIndex={2}
      anchor={0.5}
      scale={{
        x: 0.49 + (Math.log(i()+1) * 0.035),
        y: 0.49,
      }}
      position={{ x: 0, y: FINGERBOARD_TOP + 50 + d * 32.3 }}
      texture={viewportCtx?.textures.fret() ?? Texture.EMPTY}
    />}
  </For>
}