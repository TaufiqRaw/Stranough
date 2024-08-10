import {
  Assets,
  ColorMatrixFilter,
  FederatedPointerEvent,
  Filter,
  GlProgram,
  MeshRope as pxMeshRope,
  TextStyle,
  Texture,
  Container as pxContainer,
  Sprite as pxSprite,
  RenderContainer,
  Color,
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
  on,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import { Container, DrawCall, Graphics, MeshRope, Sprite, Text, useApplication } from "solid-pixi";
import { Graphics as pxGraphics } from "pixi.js";
import { createContext } from "solid-js";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { Position, PositionWithRotation } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import * as R from "remeda";
import fragment from "~/commons/shader/whiteify.frag?raw";
import vertex from "~/commons/shader/whiteify.vert?raw";
import { ElecticModelPresenterProps } from "../types";
import { ColorGradientFilter, DropShadowFilter, GlowFilter, GrayscaleFilter, OutlineFilter, SimpleLightmapFilter } from "pixi-filters";
import {ElectricModel as ElectricModelConfig, Bridge as BridgeConfig, GuitarBuilder, Colors} from 'stranough-common'
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { getNeckWidth } from "~/commons/functions/neck-width";
import { generateBurstTexture } from "~/commons/functions/generate-burst-texture";
import { GuitarBuilderRegisterStringSpawnpoints } from "~/pages/guitar-builder/presenter/guitar-builder-string-presenter";

const NECK_FROM_BRIDGE = 240;
const NECK_PICKUP_FROM_BRIDGE = 180;
const MIDDLE_PICKUP_FROM_BRIDGE = 122;
const BRIDGE_PICKUP_FROM_BRIDGE = 56;

interface GuitarBodyPresenterContext {
  neckPosition: () => Position | undefined;
  neckContainer : Accessor<pxContainer | undefined>;
  setNeckTexture: Setter<Texture | null>;
  isFront: () => boolean;
  type?: () => typeof ElectricModelConfig.constructionKeys[number] | undefined;
  isElectric: () => boolean;
  selectedMask : Accessor<Texture | undefined>;
  backWoodTexture?: Accessor<Texture | undefined>;
  leftMostPoint: ()=>Position | undefined;
  scale: () => number | undefined;
  container: Accessor<pxContainer | null>;
}

interface PrivateCtxType {
  borderPoints: () => Position[] | undefined;
  hasTopWood: () => boolean;
  hasFingerboard: () => boolean;
  electronicCoverSP: () => {x ?:number, y ?:number, rotation ?: number} | undefined;
  batteryCoverSP: () => {x ?:number, y ?:number, rotation ?: number} | undefined;
  textures : {
    neckTexture: Accessor<Texture | null>;
    selectedWoodTexture : Accessor<Texture | undefined>;
    selectedNeckWoodTexture : Accessor<Texture | undefined>;
  },
  stringCount: () => number;
  woodToBodyScale: () => number;
  fingerboardSP : ()=>Position | undefined;
  topPoint: ()=>Position | undefined;
  bottomPoint: ()=>Position | undefined;
}

export const GuitarBodyPresenterContext = createContext<GuitarBodyPresenterContext>();
export function useGuitarBodyPresenterContext() {
  return useContext(GuitarBodyPresenterContext);
}

const PrivateCtx = createContext<PrivateCtxType>();

export function ElectricModelPresenter(_props: ElecticModelPresenterProps) {
  const props = mergeProps(
    { isFront: true, body: { type: "boltOnBody" } },
    _props,
    {stringCount : () => _props.stringCount?.() ? _props.stringCount()! === 12 ? 6 :  Math.max(_props.stringCount()!, 6) : 6}
  );
  const guitarBuilderCtx = useGuitarBuilderContext();
  const [container, setContainer] = createSignal<pxContainer | null>(null);

  const [neckTexture, setNeckTexture] =
    createSignal<Texture | null>(null);

  const [neckContainer, setNeckContainer] =
    createSignal<pxContainer>();

  const selectedWoodTexture = createPixiTexture(
    () => props.body.coreWood ?? Constants.woodUrl["alder"],
    false
  );

  const textures = {
    mask: createPixiTexture(() => props.body.mask),
    frontContourTexture: createPixiTexture(() => props.body.topContourTexture),
    backContourTexture: createPixiTexture(() => props.body.backContourTexture),
    neckWood: createPixiTexture(
      () => props.neckWood ?? Constants.woodUrl["alder"],
      false
    ),
    topWood : createPixiTexture(
      () => props.body.topWood ?? Constants.woodUrl["alder"],
      false
    ),
  };

  const selectedMask = createMemo(() => {
    return textures.mask();
  }
  );

  // make sure the body texture height is not bigger than the guitar wood height
  // if it is, scale it down using this number, both width and height
  const woodToBodyScale = createMemo(() => {
    return (selectedMask()?.height ?? 1) / (selectedWoodTexture()?.height ?? 1);
  });

  //TODO: make hole dynamic (user can choose)
  const fHoleSprite = createPixiTexture(() => Constants.fHoleTexture, false);

  return (
    <Container>
      <GuitarBodyPresenterContext.Provider
        value={{
          isFront: () => props.isFront,
          type: () => props.body.type,
          setNeckTexture: setNeckTexture,
          neckPosition: () => props.spawnpoints.bridge ? ({
            x: props.spawnpoints.bridge!.x,
            y: props.spawnpoints.bridge!.y - NECK_FROM_BRIDGE,
          }) : undefined,
          isElectric: () => true,
          leftMostPoint: () => props.body.leftMostPoint,
          selectedMask,
          scale: () => props.body.scale,
          container,
          neckContainer,
        }}
      >
        <PrivateCtx.Provider
          value={{
            textures : {
              selectedNeckWoodTexture : () => textures.neckWood(),
              neckTexture,
              selectedWoodTexture,
            },
            stringCount: () => props.stringCount(),
            woodToBodyScale,
            borderPoints: () => props.spawnpoints.borderPoints,
            hasTopWood: () => props.body.topWood !== undefined,
            hasFingerboard: () => props.fingerboard !== undefined,
            fingerboardSP : () => props.spawnpoints.bridge ? ({
              x: props.spawnpoints.bridge!.x,
              y: props.spawnpoints.bridge!.y - NECK_FROM_BRIDGE,
            }) : undefined,
            topPoint: () => props.spawnpoints.topEnd,
            bottomPoint: () => props.spawnpoints.bottomEnd,
            electronicCoverSP : () => props.spawnpoints.electronicCover,
            batteryCoverSP : () => props.spawnpoints.batteryCover,
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

          <Bindings/>

          <SideViewer/>

          <Strings/>

          <Show when={props.colorOverlay}>
            <Container scale={props.body.scale ?? 1} zIndex={1.01}>{props.colorOverlay!()}</Container>
          </Show>
          
          <Bursts/>

          <TopWood textureUrl={props.body.topWood}/>

          <Sprite
            zIndex={2}
            texture={
              (props.isFront
                ? textures.frontContourTexture()
                : textures.backContourTexture()) ?? Texture.EMPTY
            }
            anchor={0.5}
            scale={props.body.scale ?? 1}
          />

          <Show when={props.fingerboard && props.spawnpoints.bridge}>
            <Show
              when={props.body.type !== "neckThroughConstruction"}
              fallback={props.fingerboard!()}
            >
              <Container
                uses={setNeckContainer}
                zIndex={props.isFront ? 2 : 0}
                position={{
                  x: props.spawnpoints.bridge!.x!,
                  y: props.spawnpoints.bridge!.y! - NECK_FROM_BRIDGE,
                }}
              >
                {props.fingerboard!()}
              </Container>
            </Show>
          </Show>

          <Show when={props.jack?.side && !!props.spawnpoints.jack?.side}>
            <Container
              zIndex={0}
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
          <Show when={guitarBuilderCtx ? (guitarBuilderCtx?.electric.bodyType.get() === 'hollow' || guitarBuilderCtx?.electric.bodyType.get() === 'semi-hollow') : true}>
            {/* Left Hole */}
            <Show when={props.spawnpoints.leftHole}>
              <Sprite
                anchor={0.5}
                zIndex={1.02}
                texture={fHoleSprite() ?? Texture.EMPTY}
                position={{
                  x: props.spawnpoints.leftHole!.x!,
                  y: props.spawnpoints.leftHole!.y!,
                }}
                rotation={props.spawnpoints.leftHole!.rotation}
                scale={props.holeScale ?? 1}
              />
            </Show>

            {/* Right Hole */}
            <Show when={props.spawnpoints.rightHole}>
              <Container
                zIndex={1.02}
                scale={{ x: -1, y: 1 }}
                position={{
                  x: props.spawnpoints.rightHole!.x!,
                  y: props.spawnpoints.rightHole!.y!,
                }}
              >  
                <Sprite
                  anchor={0.5}
                  texture={fHoleSprite() ?? Texture.EMPTY}
                  rotation={props.spawnpoints.rightHole!.rotation}
                  scale={props.holeScale ?? 1}
                />
              </Container>
            </Show>
            <Show when={props.mirrorHole && props.spawnpoints.leftHole && props.spawnpoints.bridge}>
              <Container
                zIndex={1.02}
                scale={{ x: -1, y: 1 }}
                position={{
                  x: props.spawnpoints.bridge!.x! * 2 - props.spawnpoints.leftHole!.x!,
                  y: props.spawnpoints.leftHole!.y!,
                }}
              >  
                <Sprite
                  anchor={0.5}
                  texture={fHoleSprite() ?? Texture.EMPTY}
                  rotation={props.spawnpoints.leftHole!.rotation}
                  scale={props.holeScale ?? 1}
                />
              </Container>
            </Show>
          </Show>
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

            <Show when={props.pickguard}>
              <Container zIndex={1.021}>
                {props.pickguard!()}
              </Container>
            </Show>

            <Show
              when={props.bridge && props.spawnpoints.bridge && props.spawnpoints.bottomEnd}
            >
              <Show
                when={props.bridge![0]}
              >
                <Show when={props.bridge![0]!.type !== 'mono'} 
                  fallback={
                    // if bridge is mono
                    <Container 
                      zIndex={1.03}
                      position={{
                        x : props.spawnpoints.bridge?.x! + 7,
                        y : props.spawnpoints.bridge?.y!,
                      }}
                    >
                      <For each={Array.from({length : props.stringCount()}, ()=>null)}>
                        {(_, i)=><Container
                          position={{
                            y : 0,
                            x : (i() * getNeckWidth.bottom(props.stringCount() ?? 6) / (props.stringCount() ?? 6)) - (getNeckWidth.bottom(props.stringCount() ?? 6) / 2),
                          }}
                        >
                          {props.bridge![0]!.render()}
                        </Container>}
                      </For>
                      <GuitarBuilderRegisterStringSpawnpoints
                        spawnpoints={() => Array.from({length : props.stringCount()}, (_, i)=>({
                          x : (i * getNeckWidth.bottom(props.stringCount() ?? 6) / (props.stringCount() ?? 6)) - (getNeckWidth.bottom(props.stringCount() ?? 6) / 2),
                          y : 0,
                        }))}
                        type="bridge"
                      />
                    </Container>
                  }
                >
                  {/* if bridge not mono */}
                  <Container
                    uses={c=>c.filters = [ new DropShadowFilter({
                      blur: 2,
                      offset: { x: 4, y: 2 },
                      alpha: 0.4,
                      resolution: 4,
                    })]}
                    zIndex={1.03} 
                    position={props.bridge![0]!.type === BridgeConfig.BridgeType.Tailpiece ? {
                      x: props.spawnpoints.bridge!.x!,
                      y: ((props.bridgeToBottom?.() ?? 0) < props.bridge![0]!.bottomPointY) 
                        ? props.spawnpoints.bridge!.y + 50
                        : props.spawnpoints.bottomEnd!.y - props.bridge![0]!.bottom.y
                    } : props.spawnpoints.bridge}
                  >
                    {props.bridge![0]!.render()}
                  </Container>
                </Show>
              </Show>

              {/* invariant : bridge[1] (bridge2) will always either be tuneomatic or tailpiece  */}
              <Show
                when={props.bridge![1]}
              >
                <Container
                  uses={c=>c.filters = [ new DropShadowFilter({
                    blur: 2,
                    offset: { x: 4, y: 2 },
                    alpha: 0.4,
                    resolution: 4,
                  })]}
                  zIndex={1.03} 
                  position={props.bridge![1]!.type === BridgeConfig.BridgeType.Tailpiece ? {
                    x: props.spawnpoints.bridge!.x!,
                    y: ((props.bridgeToBottom?.() ?? 0) < props.bridge![1]!.bottomPointY) 
                        ? props.spawnpoints.bridge!.y + 50
                        : props.spawnpoints.bottomEnd!.y - props.bridge![1]!.bottom.y
                  } : props.spawnpoints.bridge}
                >
                  {props.bridge![1]!.render()}
                </Container>
              </Show>
            </Show>

            <Show
              when={props.switch && props.spawnpoints.switch}
            >
              <Container
                zIndex={1.022}
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
                props.pickup && props.pickup.items[0] && (props.pickup.type?.length ?? 0) > 1
              }
            >
              <Container zIndex={1.022} position={{
                x: props.spawnpoints.bridge!.x!,
                y: props.spawnpoints.bridge!.y! - NECK_PICKUP_FROM_BRIDGE,
              }}>
                {props.pickup?.items[0]?.()}
              </Container>
            </Show>

            <Show
              when={
                (props.pickup && props.pickup.items[1] && (props.pickup.type?.length ?? 0) == 3)
              }
            >
              <Container zIndex={1.022} position={{
                x: props.spawnpoints.bridge!.x!,
                y: props.spawnpoints.bridge!.y! - MIDDLE_PICKUP_FROM_BRIDGE,
              }}>
                <Show when={props.pickup && props.pickup.items[1] && (props.pickup.type?.length ?? 0) == 3}>
                  {props.pickup?.items[1]!()}
                </Show>
              </Container>
            </Show>

            <Show
              when={
                (props.pickup && props.pickup.items[0] && (props.pickup.type?.length ?? 0) == 1)
                || (props.pickup && props.pickup.items[1] && (props.pickup.type?.length ?? 0) == 2)
                || (props.pickup && props.pickup.items[2] && (props.pickup.type?.length ?? 0) == 3)
              }
            >
              <Container zIndex={1.022} position={{
                x: props.spawnpoints.bridge!.x!,
                y: props.spawnpoints.bridge!.y! - BRIDGE_PICKUP_FROM_BRIDGE,
              }}>
                <Show when={props.pickup && props.pickup.items[0] && (props.pickup.type?.length ?? 0) == 1}>
                  {props.pickup?.items[0]!()}
                </Show>
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
                  <Container zIndex={1.022} position={knob}>
                    {props.knobs?.[i()]?.() ?? <></>}
                  </Container>
                )}
              </For>
            </Show>
          </Show>
          {/* Back Facing Components */}
          <Show when={!props.isFront}>
            <ElectronicCover/>
            <BatteryCover/>
          </Show>
          {props.children}
        </Container>
        </PrivateCtx.Provider>
      </GuitarBodyPresenterContext.Provider>
    </Container>
  );
}

function SideViewer(){
  const displayWidth = 100;
  const displayHeight = 100;

  const model = useGuitarBodyPresenterContext()!;
  const privateCtx = useContext(PrivateCtx)!;
  const guitarBuilderCtx = useGuitarBuilderContext();

  const [baseMask, setBaseMask] = createSignal<pxSprite | null>(null);
  const [woodSprite, setWoodSprite] = createSignal<pxSprite | null>(null);

  const burstType = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.burstType.get());
  const burstColor = createMemo(()=>GuitarBuilder.getValue(Colors.burstColors, guitarBuilderCtx?.getSelectedCategoryObj()?.burstColor.get()));

  const rightPurfling = createPixiTexture(() => Constants.getPurflingUrl(guitarBuilderCtx?.getSelectedCategoryObj()?.topBinding.get()), false);
  const leftPurfling = createPixiTexture(() => Constants.getPurflingUrl(guitarBuilderCtx?.getSelectedCategoryObj()?.backBinding.get()), false);

  const backBodyColorType = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.backBodyColorType.get());
  const _backBodyColor = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.backBodyColor.get());

  const backBodyColor = createMemo(()=>{
    if(_backBodyColor() === undefined) return undefined;
    switch(backBodyColorType()){
      case 'solid' :
      case 'transparent' : 
        return Colors.solidColors[_backBodyColor()! as keyof typeof Colors.solidColors].value
      case 'metallic' :
        return Constants.metallicColorUrl[_backBodyColor()! as keyof typeof Colors.metallicColors]
    }
  });

  createEffect(()=>{
    if(woodSprite() === undefined || !woodSprite()?.texture) return;
    //grayscale the wood when back color is selected
    if(backBodyColor()){
      const grayscale = new ColorMatrixFilter();
      grayscale.desaturate();
      woodSprite()!.filters = [grayscale];
    }else{
      woodSprite()!.filters = [];
    }
  })

  const backTexture = createPixiTexture(()=>typeof backBodyColor() === 'string' ? backBodyColor() as string : undefined, false);

  return <Container
  zIndex={0}
  position={{
    x : (model.leftMostPoint()?.x ?? 0) - ((model.selectedMask()?.width ?? 0) / 2) * (model.scale() ?? 0) - 150,
    y : ((privateCtx.topPoint()?.y ?? 0) + ((privateCtx.bottomPoint()?.y ?? 0)) / 2) * (model.scale() ?? 0) + 70,
  }}
>
  <Show when={!!model.selectedMask()}>
    <Text
      position={{
        x : 11 + (model.isFront() ? 0 : displayWidth - 16),
        y : -80,
      }}
      scale={{
        x : model.isFront() ? 1 : -1,
        y : 1,
      }}
        style={new TextStyle({
          fontSize: 20,
          align: "center",
        })}
      >
      {"Tampilan\nSamping\nBody"}
    </Text>
    <Graphics
      draw={[
        ['roundRect', 0, 0, displayWidth, displayHeight, 10],
        ['stroke', {
          color: 0x000000,
          width: 5,
        }],
      ]}
    />

    <Container
      mask={baseMask()}
    >
      <Show when={burstType() === 'top-back' && burstColor()}>
        <Graphics
          zIndex={0.1}
          draw={[
            ['rect', 0, 0, displayWidth, displayHeight],
            ['fill', burstColor()![0]],
          ]}
        />
      </Show>
      <Show when={backBodyColor()}>
        <Show when={typeof backBodyColor() === 'string'}
          fallback={
            <Graphics
            zIndex={0.01}
            draw={[
              ['rect', 
                0, 0, displayWidth, displayHeight],
              ['fill', backBodyColor() ?? 0x00000]
            ]}
            alpha={backBodyColorType() === 'transparent' ? 0.6 : 1}
          />
          }
        >
          <Sprite
            zIndex={0.01}
            anchor={0.5}
            texture={backTexture() ?? Texture.EMPTY}
            scale={(backTexture()?.width ?? 1)/displayWidth}
          />
        </Show>
      </Show>
      <Sprite
        zIndex={0}
        texture={privateCtx.textures.selectedWoodTexture() ?? Texture.EMPTY}
        anchor={0.5}
        uses={setWoodSprite}
      />
      <MeshRope
        zIndex={1}
        points={[
          { x: 0, y: 0 },
          { x: 0, y: displayHeight },
        ]}
        texture={leftPurfling() ?? Texture.EMPTY}
        textureScale={0.5}
      />
      <MeshRope
        zIndex={1}
        points={[
          { x: displayWidth, y: displayHeight },
          { x: displayWidth, y: 0 },
        ]}
        texture={rightPurfling() ?? Texture.EMPTY}
        textureScale={0.5}
      />
      <Graphics
        uses={setBaseMask}
        draw={[
          ['roundRect', 0, 0, displayWidth, displayHeight, 10],
          ['fill', 0x000000],
        ]}
      />

    </Container>
  </Show>

</Container>
}

// body starts here
function Body(){
  const model = useGuitarBodyPresenterContext()!;
  const privateCtx = useContext(PrivateCtx)!;
  const guitarBuilderCtx = useGuitarBuilderContext();
  const [woodSprite, setWoodSprite] = createSignal<pxSprite>();
  
  createEffect(()=>{
    if(woodSprite() === undefined) return;
    if(model.isFront()){
      //grayscale the top color when top color is selected
      if(guitarBuilderCtx?.getSelectedCategoryObj()?.topBodyColor.get()){
        const grayscale = new ColorMatrixFilter();
        grayscale.desaturate();
        woodSprite()!.filters = [grayscale];
      }else{
        woodSprite()!.filters = [];
      }
    }else{
      //grayscale the back color when back color is selected
      if(guitarBuilderCtx?.getSelectedCategoryObj()?.backBodyColor.get()){
        const grayscale = new ColorMatrixFilter();
        grayscale.desaturate();
        woodSprite()!.filters = [grayscale];
      }else{
        woodSprite()!.filters = [];
      }
    }
  })

  return <>
    <Container
      zIndex={model.isFront() ? 0 : model.type!() === "neckThroughConstruction" ? 0 : 1 }
      scale={model.scale() ?? 1}
    >
      <MaskedBodyPresenter>
        {()=><Sprite
          scale={privateCtx.woodToBodyScale() ?? 1}
          texture={privateCtx.textures.selectedWoodTexture() ?? Texture.EMPTY}
          anchor={0.5}
          uses={setWoodSprite}
        />}
      </MaskedBodyPresenter>
    </Container>
    <NeckThroughBody/>
  </>
}

export function MaskedBodyPresenter(props : {
  children : ((m : Accessor<pxSprite | null>)=>JSX.Element);
  zIndex ?: number;
}){
  const [guitarBodyMask, setGuitarBodyMask] = createSignal<pxSprite | null>(
    null
  );

  const model = useGuitarBodyPresenterContext()!;
  const privateCtx = useContext(PrivateCtx)!;


  // hacks to make sure the mask is updated
  createEffect(()=>model.type?.());

  return <Container
    zIndex={props.zIndex ?? 0}
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
      {/* <NeckThroughBodyNoNeck/> */}
    </Show>
  </>
}

// function NeckThroughBodyNoNeck(
//   props : {
//   }
// ){
//   const model = useGuitarBodyPresenterContext()!;
//   const privateCtx = useContext(PrivateCtx)!;
//   const app = useApplication();

//   const [maskSprite, setMaskSprite] = createSignal<pxSprite | null>(null);
//   return <Show when={!privateCtx.hasFingerboard()}>
//     <Container
//       zIndex={model.isFront() ? 0 : 1}
//       scale={model.scale() ?? 1}
//       mask={maskSprite()}
//     >
//       <Show when={maskSprite()}>
//         <Sprite
//           texture={privateCtx.textures.selectedWoodTexture() ?? Texture.EMPTY}
//           anchor={0.5}
//           scale={privateCtx.woodToBodyScale() ?? 1}
//         />
//       </Show>
//       <Sprite
//         uses={[
//           (s) => {
//             const listener = (tex: Texture) => {
//               console.log(tex);
//               s.texture = tex;
//             };
//             s.parent.addListener("textureGenerated", listener);
//             onCleanup(() =>
//               s.parent.removeListener("textureGenerated", listener)
//             );
//           },
//           setMaskSprite,
//         ]}
//         anchor={0.5}
//         texture={Texture.EMPTY}
//       />
//       <Container>
//         <Sprite
//           uses={[
//             (s) => {
//               onMount(() => {
//                 s.alpha = 1;
//                 s.filters = [invertColorFilter];
//                 const mask = app?.renderer.generateTexture({
//                   target: s.parent,
//                 });
//                 if (mask) {
//                   s.parent.parent.emit("textureGenerated", mask);
//                 }
//                 s.alpha = 0;
//               });
//             },
//           ]}
//           texture={model.selectedMask() ?? Texture.EMPTY}
//           anchor={0.5}
//           zIndex={0}
//         />
//       </Container>
//     </Container>
//   </Show>
// }

// render the neck through body with the neck
function NeckThroughBodyWithNeck(props : {
}){
  const model = useGuitarBodyPresenterContext()!;
  const app = useApplication();
  const privateCtx = useContext(PrivateCtx)!;

  const [renderedNeckThroughMask, setRenderedNeckThroughMask] =
    createSignal<Texture | null>(null);
  const [neckThroughMaskSprite, setNeckThroughMaskSprite] =
    createSignal<pxSprite | null>(null);
  const [neckThroughMaskGraphics, setNeckThroughMaskGraphics] =
    createSignal<pxGraphics | null>(null);

  // destroy previous rendered neck through mask
  createEffect(on(renderedNeckThroughMask, (val, prev)=>{
    if(prev && prev !== val){
      prev.destroy(true);
    }
  }))

  onCleanup(() => {
    renderedNeckThroughMask()?.destroy(true);
  });

  // hacks to make sure the mask is updated
  createEffect(() => {
    privateCtx.textures.neckTexture();
    neckThroughMaskSprite();
    model.scale();
    neckThroughMaskGraphics();
    neckThroughMaskSprite()?.emit("change");
  });

  const neckWidthBottom = createMemo(() => getNeckWidth.bottom(privateCtx.stringCount()));

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
              setRenderedNeckThroughMask(newTex);
            }
            c.alpha = 0;
          },
          { waitMs: 20 }
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
      <Container>
        <Sprite
          uses={[
            setNeckThroughMaskSprite,
            (s) => {
              const listener = () => {
                s.parent.parent.emit("maskUpdated");
                setTimeout(() => s.parent.parent.emit("maskUpdated"), 100);
              };
              s.on("change", listener);
              onCleanup(() => s.off("change", listener));
            },
          ]}
          texture={model.selectedMask() ?? Texture.EMPTY}
          anchor={0.5}
          zIndex={0}
          scale={model.scale() ?? 1}
          mask={neckThroughMaskGraphics()}
        />
        <Graphics
          uses={setNeckThroughMaskGraphics}
          alpha={0}
          draw={[
            ['rect', -neckWidthBottom()/2 + (privateCtx.fingerboardSP()?.x ?? 0), -2500, neckWidthBottom(), 5000],
            ['fill', 0xffffff],
          ]}
        />
      </Container>
    </Show>
  </Container>
  <NeckThroughBodyWithNeckWood renderedNeckThroughMask={renderedNeckThroughMask}/>
</Show>}

// show the rendered neck through mask and the neck wood
function NeckThroughBodyWithNeckWood(props : {
  renderedNeckThroughMask : ()=>Texture | null;
}){
  const model = useGuitarBodyPresenterContext()!;
  const guitarBuilderCtx = useGuitarBuilderContext();
  const privateCtx = useContext(PrivateCtx)!;
  
  const [maskSprite, setMaskSprite] = createSignal<pxSprite>();
  const [bodyOnlyAreaMask, setBodyOnlyAreaMask] = createSignal<pxSprite>();
  const [bodyOnlyAreaSpriteWood, setBodyOnlyAreaSpriteWood] = createSignal<pxSprite>();
  const [neckWoodSprite, setNeckWoodSprite] = createSignal<pxSprite>();

  createEffect(()=>{
    if(bodyOnlyAreaSpriteWood() === undefined) return;
    if(model.isFront()){
      //grayscale the top color when top color is selected
      if(guitarBuilderCtx?.getSelectedCategoryObj()?.topBodyColor.get()){
        const grayscale = new ColorMatrixFilter();
        grayscale.desaturate();
        bodyOnlyAreaSpriteWood()!.filters = [grayscale];
      }else{
        bodyOnlyAreaSpriteWood()!.filters = [];
      }
    }else{
      //grayscale the back color when back color is selected
      if(guitarBuilderCtx?.getSelectedCategoryObj()?.backBodyColor.get()){
        const grayscale = new ColorMatrixFilter();
        grayscale.desaturate();
        bodyOnlyAreaSpriteWood()!.filters = [grayscale];
      }else{
        bodyOnlyAreaSpriteWood()!.filters = [];
      }
    }
    if(neckWoodSprite() === undefined) return;
    if(guitarBuilderCtx?.electric.neckColor.get()){
      const grayscale = new ColorMatrixFilter();
      grayscale.desaturate();
      neckWoodSprite()!.filters = [grayscale];
    } else {
      neckWoodSprite()!.filters = [];
    }
  })

  const selectedMaskHeight = createMemo(() => {
    return model.selectedMask()?.height;
  })

  const woodToBodyScale = createMemo(() => {
    return (props.renderedNeckThroughMask()?.height ?? 1) / (privateCtx.textures.selectedNeckWoodTexture()?.height ?? 1);
  });
  return <Show when={privateCtx.textures.neckTexture()}>
    <Container
      zIndex={0}
      mask={maskSprite()}
      position={{
        x: privateCtx.fingerboardSP()?.x ?? 0,
        y:
          ((selectedMaskHeight() ?? 0) *
            (model.scale() ?? 1)) /
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
          uses={setNeckWoodSprite}
          texture={privateCtx.textures.selectedNeckWoodTexture() ?? Texture.EMPTY}
          anchor={{ x: 0.5, y: 1 }}
          scale={woodToBodyScale() ?? 1}
        />
      </Show>
    </Container>
    <Container scale={model.scale() ?? 1}>
    <MaskedBodyPresenter>
      {()=><Container
        zIndex={0.1}
        mask={bodyOnlyAreaMask()}
        position={{
          x: privateCtx.fingerboardSP()?.x ?? 0,
          y:
            ((selectedMaskHeight() ?? 0) *
              (model.scale() ?? 1)) /
            2,
        }}
      >
        <Sprite
          uses={setBodyOnlyAreaMask}
          texture={props.renderedNeckThroughMask() ?? Texture.EMPTY}
          anchor={{ x: 0.5, y: 1 }}
        />
        <Sprite
          texture={privateCtx.textures.selectedNeckWoodTexture() ?? Texture.EMPTY}
          anchor={{ x: 0.5, y: 1 }}
          scale={woodToBodyScale() ?? 1}
          uses={setBodyOnlyAreaSpriteWood}
        />
      </Container>}
    </MaskedBodyPresenter>
    </Container>
  </Show>
}

function Bindings(){
  const privateCtx = useContext(PrivateCtx)!;
  const model = useGuitarBodyPresenterContext()!;
  const guitarBuilderCtx = useGuitarBuilderContext();

  const topBindingTexture = createPixiTexture(() => Constants.getBindingUrl(guitarBuilderCtx?.getSelectedCategoryObj()?.topBinding.get()), false);
  const backBindingTexture = createPixiTexture(() => Constants.getBindingUrl(guitarBuilderCtx?.getSelectedCategoryObj()?.backBinding.get()), false);


  return <Show when={privateCtx.borderPoints()}>
    <Show when={model.isFront()}>
      <Binding texture={topBindingTexture}/>
    </Show>
    <Show when={!model.isFront()}>
      <Binding texture={backBindingTexture}/>
    </Show>
</Show>
}

function Binding(props : {
  texture : ()=>Texture | undefined;
}){
  const model = useGuitarBodyPresenterContext()!;
  const privateCtx = useContext(PrivateCtx)!;

  return <Container
    zIndex={1.012}
    pivot={{
      x: (model.selectedMask()?.width ?? 0) / 2,
      y: (model.selectedMask()?.height ?? 0) / 2,
    }}
    scale={(model.scale()?? 1)}
  >
    <Show when={!!props.texture()}>
      <MeshRope
        points={privateCtx.borderPoints()!}
        textureScale={0.5}
        texture={props.texture()!}
      />
    </Show>
  </Container>
}

function TopWood(props : {
  textureUrl : string | undefined;
}){
  const topWoodTexture = createPixiTexture(() => props.textureUrl, false);
  const model = useGuitarBodyPresenterContext()!;
  const privateCtx = useContext(PrivateCtx)!;
  const guitarBuilderCtx = useGuitarBuilderContext();
  const [woodSprite, setWoodSprite] = createSignal<pxSprite>();

  const topWoodToBodyScale = createMemo(() => {
    return (model.selectedMask()?.height ?? 1)/(topWoodTexture()?.height ?? 1);
  });
  
  createEffect(()=>{
    if(woodSprite() === undefined) return;
    if(model.isFront()){
      //grayscale the top color when top color is selected
      if(guitarBuilderCtx?.getSelectedCategoryObj()?.topBodyColor.get()){
        const grayscale = new ColorMatrixFilter();
        grayscale.desaturate();
        woodSprite()!.filters = [grayscale];
      }else{
        woodSprite()!.filters = [];
      }
    }
  })

  return <Show when={model.isFront() && topWoodTexture()}>
    <Container
      zIndex={0.1}
      scale={model.scale() ?? 1}
    >
      <MaskedBodyPresenter>
        {()=><Sprite
          scale={ topWoodToBodyScale() ?? 1}
          texture={topWoodTexture() ?? Texture.EMPTY}
          anchor={0.5}
          uses={setWoodSprite}
        />}
      </MaskedBodyPresenter>
    </Container>
  </Show>
}

function Bursts(){
  const bodyCtx = useGuitarBodyPresenterContext()!;
  const guitarBuilderCtx = useGuitarBuilderContext();
  const burstType = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.burstType.get());
  const burstColor = createMemo(()=>GuitarBuilder.getValue(Colors.burstColors, guitarBuilderCtx?.getSelectedCategoryObj()?.burstColor.get()));
  return <Container zIndex={1.011}>
    <Show when={bodyCtx.isFront() && burstType() && burstColor()}>
      <Burst color={burstColor()![0]} baseLength={0} gradientLength={100} zIndex={1.1}/> 
      <Burst color={burstColor()![1] ? burstColor()![1]! : burstColor()![0]} baseLength={30} gradientLength={100} zIndex={1}/>
    </Show>
    <Show when={!bodyCtx.isFront() && burstType() === "top-back" && burstColor()}>
      <Burst color={burstColor()![0]} baseLength={0} gradientLength={100} zIndex={1.1}/> 
      <Burst color={burstColor()![1] ? burstColor()![1]! : burstColor()![0]} baseLength={30} gradientLength={100} zIndex={1}/>
    </Show>
  </Container>
}

function Burst(props : {
  color : number | Color;
  baseLength : number;
  gradientLength : number;
  zIndex ?: number;
}){
  const privateCtx = useContext(PrivateCtx)!;
  const guitarBodyCtx = useContext(GuitarBodyPresenterContext)!;

  const burstTexture = createMemo((()=>(guitarBodyCtx.selectedMask() && privateCtx.borderPoints) 
  ? generateBurstTexture(
    guitarBodyCtx.selectedMask()!.source as unknown as HTMLImageElement, privateCtx.borderPoints()!, {
    baseLength : props.baseLength,
    gradientLength : props.gradientLength,
  }) : undefined));

  const [burstMask, setBurstMask] = createSignal<pxSprite | null>(null);
  return <Show when={burstTexture()}>
    <Container
      zIndex={props.zIndex ?? 1}
      scale={guitarBodyCtx.scale() ?? 1}
      mask={burstMask()}
    >
      <Sprite
        texture={burstTexture() ?? Texture.EMPTY}
        anchor={0.5}
        uses={setBurstMask}
      />
      <Graphics
        draw={[
          ['rect', -500, -500, 2000, 2000],
          ['fill', props.color],
        ]}
      />
    </Container>
  </Show>
}

function ElectronicCover(){
  const privateCtx = useContext(PrivateCtx)!;
  const electronicCoverTexture = createPixiTexture(() => "/assets/cover/cavity.png", false);
  return <Show when={privateCtx.electronicCoverSP()}>
    <Sprite
      zIndex={1.02}
      texture={electronicCoverTexture() ?? Texture.EMPTY}
      position={{
        x: privateCtx.electronicCoverSP()!.x!,
        y: privateCtx.electronicCoverSP()!.y!,
      }}
      anchor={0.5}
      rotation={privateCtx.electronicCoverSP()!.rotation ?? 0}
    />
  </Show>
}

function BatteryCover(){
  const privateCtx = useContext(PrivateCtx)!;
  const batteryCoverTexture = createPixiTexture(() => "/assets/cover/battery.png", false);
  return <Show when={privateCtx.batteryCoverSP()}>
    <Sprite
      zIndex={1.02}
      texture={batteryCoverTexture() ?? Texture.EMPTY}
      position={{
        x: privateCtx.batteryCoverSP()!.x!,
        y: privateCtx.batteryCoverSP()!.y!,
      }}
      anchor={0.5}
      rotation={privateCtx.batteryCoverSP()!.rotation ?? 0}
    />
  </Show>
}

function Strings(){
  const guitarBuilderCtx = useGuitarBuilderContext();
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const stringSpawnPoints = createMemo(()=>guitarBuilderCtx?.stringSpawnpoints.fromTop());

  return <Show when={stringSpawnPoints() && guitarBodyCtx?.isFront()}>
    <For each={stringSpawnPoints()}>
      {(points, i) => <Graphics
        zIndex={2.01}
        draw={[
          ['moveTo', points[0].x, points[0].y],
          ...points.slice(1).map((p) => ['lineTo', p.x, p.y] as DrawCall),
          ['stroke', {
            color: 0xffffff,
            width: 2,
          }]
        ]}
      />}
    </For>
  </Show>
}

// export function NeckThroughToFullMaskedPresenter(props : {
//   children : ((m : Accessor<pxSprite | null>)=>JSX.Element);
// }){
//   const model = useGuitarBodyPresenterContext()!;
//   const app = useApplication();
//   const privateCtx = useContext(PrivateCtx)!;
//   const [mask, setMask] = createSignal<pxSprite | null>(null);
//   return <Container>
//     <Container zIndex={1}>
//     {props.children(mask)}
//     </Container>
//     <Sprite
//       anchor={0.5}
//       texture={model.selectedMask() ?? Texture.EMPTY}
//     />
//   </Container>
// }