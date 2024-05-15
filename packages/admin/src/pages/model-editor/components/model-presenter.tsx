import { Container, Graphics, Sprite, useApplication, useParent } from "solid-pixi";
import { useGuitarModelSignal } from "../guitar-model.context";
import {
  Accessor,
  For,
  Show,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import { Color, FederatedPointerEvent, GraphicsContext, Graphics as pxGraphics, Sprite as pxSprite,Texture, Container as pxContainer } from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import { getFretDistances } from "../utils/function/get-fret-distances.util";
import { createContext } from "solid-js";
import { createLoadSelectedBodyTexture } from "~/pages/model-editor/utils/create-load-selected-body-texture.hook";
import { itemOr } from "../utils/function/item-or";

const spIndicatorGraphics = new GraphicsContext();
spIndicatorGraphics
  .circle(0, 0, 10)
  .fill(new Color('blue'));

const emptyGraphics = new GraphicsContext();

interface GuitarBodyPresenterContext {
  guitarBodyMask : Accessor<pxSprite | null>;
  container : Accessor<pxContainer | null>;
}
  

const GuitarBodyPresenterContext = createContext<GuitarBodyPresenterContext>();
export function useGuitarBodyPresenterContext(){
  return useContext(GuitarBodyPresenterContext);
}

export function ModelPresenter() {
  const guitarModel = useGuitarModelSignal();

  const viewport = useParent();

  const woodTextures = Texture.from("/assets/alder.jpg");

  const [guitarBodyMask, setGuitarBodyMask] = createSignal<pxSprite | null>(null);

  const [container, setContainer] = createSignal<pxContainer | null>(null);

  const selectedBodyTextureLoaded = createLoadSelectedBodyTexture();

  // make sure the body texture height is not bigger than the guitar wood height
  // if it is, scale it down using this number, both width and height
  const initialBodyWoodScale = createMemo(() => {
    const res = (selectedBodyTextureLoaded()?.mask?.height || 1) / (woodTextures.height || 1);
    return res;
  });

  return (
    <>
      <Show when={!!selectedBodyTextureLoaded()}>
        <Show
          when={
            selectedBodyTextureLoaded()?.mask
          }
        >
          <Container
            position={{
              x : viewport.width / 2,
              y : viewport.height / 2
            }}
            interactive
            uses={
              [ setContainer,
                (container)=>{
                const listener = (e : FederatedPointerEvent)=>{
                  const newPoint = container.toLocal(e.global);
                  guitarModel.getSelectedBodySignal()?.spawnPoints.getSelectedSignal()?.set(newPoint!);
                  guitarModel.getSelectedBodySignal()?.spawnPoints.selected.set(undefined);
                }
                container.addListener('click', listener);
                onCleanup(()=>{
                  container.removeListener('click', listener);
                })
              }]
            }
          >
            <Container 
              mask={guitarBodyMask()}
              scale={guitarModel.getSelectedBodySignal()?.getSelectedBodyTextureSignal()?.scale.get() || 1}
            >
              <Sprite
                scale={{
                  x: initialBodyWoodScale(),
                  y: initialBodyWoodScale(),
                }}
                texture={woodTextures} anchor={0.5} 
              />
              <Sprite
                texture={selectedBodyTextureLoaded()?.mask || Texture.EMPTY}
                anchor={0.5}
                uses={setGuitarBodyMask}
              />              
              <Sprite
                width={guitarBodyMask()?.width}
                height={guitarBodyMask()?.height}
                texture={selectedBodyTextureLoaded()?.frontShadowTexture || Texture.EMPTY}
                anchor={0.5}/>
            </Container>

            <GuitarBodyPresenterContext.Provider value={{guitarBodyMask, container}}>
              <Fingerboard/>
            </GuitarBodyPresenterContext.Provider>
                
            <SpawnPointsIndicator/>
          </Container>
        </Show>
      </Show>
    </>
  );
}

function SpawnPointsIndicator(){
  const guitarModel = useGuitarModelSignal();
  return <For each={guitarModel.getSelectedBodySignal()?.spawnPoints.asArray()}>
  {(point) => (
    <Graphics
    position={{
      x : point.get()?.x || 0,
      y : point.get()?.y || 0
    }}
    context={!!point.get() ? spIndicatorGraphics : emptyGraphics}
  />
  )}
  </For>
}

function Fingerboard(){
  const fretDistance = getFretDistances(25.5, 24);

  const [guitarFingerboardMask, setGuitarFingerboardMask] = createSignal<pxGraphics | null>(null);
  const guitarModel = useGuitarModelSignal();
  const app = useApplication();
  const woodTextures = Texture.from("/assets/alder.jpg");

  return <Show when={!!guitarModel.getSelectedBodySignal()?.spawnPoints.fingerboard.position.get() && guitarModel.getSelectedBodySignal()?.spawnPoints.fingerboard.isShow.get()}>
  <Container
    position={guitarModel.getSelectedBodySignal()?.spawnPoints.fingerboard.position.get()}
    uses={c=>{
      c.filters = [new DropShadowFilter({
        blur: 4,
        offset : {x:0, y:4},
        alpha : 0.3,
      })];
    }}
  >
    <Container
      mask={guitarFingerboardMask()}
    >
      <Sprite
        texture={woodTextures}
        anchor={{x:0.5, y:1}}
        scale={1.15}
      />
      <Graphics
        uses={[setGuitarFingerboardMask,
          (g)=>{
            app?.renderer.generateTexture({antialias : true, target : g})
          }
        ]}
        draw={[
          ['moveTo', -38, 0],
          ['lineTo', 38, 0],
          ['lineTo', 30, -668],
          ['lineTo', -30, -668],
          ['fill', {color : 0xffffff}]
        ]}
      />
      {
        fretDistance.map((d)=><Graphics
          position={{x : 0, y : (-668 + 50) + d * 32.3}}
          draw={[
            ['rect', -35, 0, 70, 2],
            ['fill', {color : 0xffffff}],
          ]}
        />)
      }
    </Container>
  </Container>
</Show>
}

const cornerIndicatorGraphics = new GraphicsContext();
cornerIndicatorGraphics
  .circle(0, 0, 10)
  .fill(new Color('black'));