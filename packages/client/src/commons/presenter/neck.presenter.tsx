import {
  For,
  JSX,
  Match,
  Setter,
  Show,
  Switch,
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
  TextStyle,
  ColorMatrixFilter,
} from "pixi.js";
import { getFretDistances } from "~/pages/admin/electric-model-editor/utils/functions/get-fret-distances";
import { Position } from "../interfaces/position";
import { DropShadowFilter } from "pixi-filters";
import {
  Container,
  DrawCall,
  DrawCalls,
  Graphics,
  RenderedGraphics,
  Sprite,
  Text,
  useApplication,
} from "solid-pixi";
import { useEditorPageContext } from "../components/editor-page";
import { createPixiTexture } from "../functions/create-texture";
import * as R from "remeda";
import { useViewportContext } from "../components/viewport";
import { useGuitarBodyPresenterContext } from "./guitar-model/electric-model.presenter";
import { Constants } from "~/constants";
import { Colors, GuitarBuilder } from "stranough-common";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { scaleIntoDesiredWidth } from "./utils/scale-into-desired-width";
import { getNeckWidth } from "../functions/neck-width";

const NUT_FROM_FIRST_FRET = 50;
const FRET_DISTANCE = 32.3;

const invertColorFilter = new ColorMatrixFilter();
invertColorFilter.negative(true);

const neckCtx = createContext<{
  setHeadstockMask?: Setter<pxSprite | undefined>;
  childSpawnPos?: ()=>Position;
  neckWoodTexture?: ()=>Texture | undefined;
}>();

export function useNeckContext() {
  return useContext(neckCtx);
}

const privateNeckCtx = createContext<{
  setFingerboardMask: Setter<pxContainer<ContainerChild>>;
  isFront: () => boolean | undefined;
  renderedMaskTex: () => Texture | undefined;
  fingerboardHeight: ()=> number;
  neckWidthTop: ()=> number;
  neckWidthBottom: ()=> number;
  neckWood: ()=> Texture | undefined;
  fingerboardWood: ()=> Texture | undefined;
  stringCount: ()=> number | undefined;
  fretDistance: ()=> number[];
}>();

export function NeckPresenter(_props: {
  isFront?: () => boolean | undefined;
  position?: Position;
  headstock?: () => JSX.Element;
  nut?: () => JSX.Element;
  wood?: string | undefined;
  fingerboardWood?: string | undefined;
  fretCount?: () => number | undefined;
  stringCount?: () => number | undefined;
}) {
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const props = mergeProps(
    { isFront: guitarBodyCtx?.isFront ?? (() => true)},
    _props, {
      fretCount: () => _props.fretCount?.() ? _props.fretCount() : 24,
      stringCount : () => _props.stringCount?.() ? _props.stringCount()! === 12 ? 6 :  Math.max(_props.stringCount()!, 6) : 6
    }
  );

  createEffect(()=>console.log(props.stringCount()))

  const fretDistance = createMemo(() =>
    getFretDistances(25.5, props.fretCount()!)
  );

  const fingerboardHeight = createMemo(() => {
    const frets = fretDistance();
    const lastFret = frets[frets.length - 1];
    const lastFretFromFingerboardBottom = 13;
    return lastFret * FRET_DISTANCE + lastFretFromFingerboardBottom + NUT_FROM_FIRST_FRET;
  });

  const neckWidthTop = createMemo(() => getNeckWidth.top(props.stringCount()!));
  
  const neckWidthBottom = createMemo(() => getNeckWidth.bottom(props.stringCount()!));

  const [renderedMaskTex, setRenderedMaskTex] = createSignal<Texture>();
  const [headstockMask, setHeadstockMask] = createSignal<pxSprite>();
  const [maskRenderer, setMaskRenderer] = createSignal<pxContainer>();

  const neckWood = createPixiTexture(
    () => props.wood ?? Constants.woodUrl["alder"],
    false
  );
  const fingerboardWood = createPixiTexture(
    () => props.fingerboardWood ?? Constants.woodUrl["pau-ferro"],
    false
  );


  // update mask when headstock changes
  createEffect(() => {
    props.headstock;
    headstockMask();
    maskRenderer()?.emit("maskUpdated");
  });

  onCleanup(() => {
    guitarBodyCtx?.setNeckTexture(null);
    renderedMaskTex()?.destroy(true);
  });

  // destroy previous rendered neck through mask
  createEffect(on(renderedMaskTex, (val, prev)=>{
    if(prev && prev !== val){
      console.log("destroying prev rendered mask tex");
      prev.destroy(true);
    }
  }))

  return (
    <privateNeckCtx.Provider value={{
      fingerboardHeight : fingerboardHeight,
      isFront: props.isFront,
      renderedMaskTex,
      setFingerboardMask: maskRenderer,
      neckWidthTop,
      neckWidthBottom,
      fingerboardWood,
      neckWood,
      stringCount: props.stringCount,
      fretDistance: ()=>fretDistance(),
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
        <SelectedItemIndicator/>
        <neckCtx.Provider
          value={{ 
            childSpawnPos: ()=>({ x: 0, y: fingerboardHeight() }),
            neckWoodTexture: ()=>neckWood(),
          }}
        >
          <Container zIndex={props.isFront() ? 2.1 : 1} y={-fingerboardHeight()}>{props.nut?.()}</Container>
        </neckCtx.Provider>
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
              childSpawnPos: ()=>({ x: 0, y: -fingerboardHeight() }),
              neckWoodTexture: ()=>neckWood(),
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
            neckWoodTexture: ()=>neckWood(),
            childSpawnPos: ()=>({
              x: guitarBodyCtx!.neckPosition()?.x ?? 0,
              y: -fingerboardHeight() + (guitarBodyCtx!.neckPosition()?.y ?? 0),
            }),
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
        zIndex={2}
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
            height={privateCtx.fingerboardHeight() ?? 668}
          />
        </Container>
      </Container>

      <TrussRod/>

      <RenderedGraphics
        uses={setFingerboardMask}
        alpha={0}
        anchor={{ x: 0.5, y: 1 }}
        draw={[
          ["moveTo", -privateCtx.neckWidthBottom()/2, 0],
          ["lineTo", privateCtx.neckWidthBottom()/2, 0],
          ["lineTo", privateCtx.neckWidthTop()/2, -privateCtx.fingerboardHeight()],
          ["lineTo", -privateCtx.neckWidthTop()/2, -privateCtx.fingerboardHeight()],
          ["fill", { color: 0xffffff }],
        ]}
      />
      {/* acoustic soundhole */}
      <Show when={privateCtx.isFront() && !bodyCtx?.isElectric()}>
        <Graphics
          zIndex={2.1}
          draw={[
            ['circle', 0, 45, 60],
            ['fill', { color: 0x000000 }],
          ]}
        />
      </Show>
      <Show when={privateCtx.isFront()}>
        <Frets distancesFromNut={props.fretDistance()} />
        <Inlay/>
      </Show>
    </Show>
  );
}

function NeckWoodAndShadow(props: { neckWood: () => Texture | undefined }) {
  const privateCtx = useContext(privateNeckCtx)!;
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const guitarBuilderCtx = useGuitarBuilderContext();
  const [neckMask, setNeckMask] = createSignal<pxSprite>();
  const [neckWoodSprite, setNeckWoodSprite] = createSignal<pxSprite>();

  createEffect(()=>{
    if(neckWoodSprite() === undefined) return;
    if(guitarBuilderCtx?.getSelectedCategoryObj()?.neckColor.get()){
      const grayscale = new ColorMatrixFilter();
      grayscale.desaturate();
      neckWoodSprite()!.filters = [grayscale];
    }else{
      neckWoodSprite()!.filters = [];
    }
  })
  return (
    <Container zIndex={1} mask={neckMask()}>
      <Show when={guitarBodyCtx?.type?.() !== "neckThroughConstruction"}>
        <Sprite
          texture={props.neckWood() ?? Texture.EMPTY}
          anchor={{ x: 0.5, y: 1 }}
          height={privateCtx.renderedMaskTex()?.height ?? 668}
          zIndex={1}
          uses={setNeckWoodSprite}
        />
      </Show>

      <Sprite
        anchor={{ x: 0.5, y: 1 }}
        texture={privateCtx.renderedMaskTex() ?? Texture.EMPTY}
        uses={setNeckMask}
      />

      {/* when facing back */}
      <Show when={!privateCtx.isFront()}>
        <NeckColor/>
        <FingerboardBackShadow />
      </Show>
    </Container>
  );
}

function NeckColor() {
  const privateCtx = useContext(privateNeckCtx)!;
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const guitarBuilderCtx = useGuitarBuilderContext();

  const neckColorType = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.neckColorType.get());
  const neckColor = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.neckColor.get());

  const solidNeckColor = createMemo(()=>
    (['solid', 'transparent'].includes(neckColorType() ?? '') && neckColor()) 
      ? Colors.solidColors[neckColor()! as keyof typeof Colors.solidColors].value
      : undefined
  );
  const metallicTexture = createPixiTexture(()=>neckColorType() === 'metallic' ? Constants.metallicColorUrl[neckColor()! as keyof typeof Colors.metallicColors] : undefined, false);
  const metallicTexToMaskScale = createMemo(() => {
    return (privateCtx.renderedMaskTex()?.height ?? 1) / (metallicTexture()?.height ?? 1);
  });

  return <Show when={neckColor() && neckColorType()}>
    <Show when={neckColorType() === 'metallic'}
      fallback={
        <Graphics
          draw={[
            ['rect',  -500, -(privateCtx.renderedMaskTex()?.height ?? 0 ), 1000, privateCtx.renderedMaskTex()?.height ?? 0 ],
            ['fill', { color: solidNeckColor() ?? 0xffffff }],
          ]}
          alpha={neckColorType() === 'transparent' ? 0.6 : 1}
          zIndex={1.1}
        />
      }
    >
      <Sprite
        texture={metallicTexture() ?? Texture.EMPTY}
        scale={metallicTexToMaskScale()}
        zIndex={1.1}
        anchor={{ x: 0.5, y: 1 }}
      />
    </Show>
  </Show>
}

function Frets(props: { distancesFromNut: number[] }) {
  const viewportCtx = useViewportContext();
  const privateCtx = useContext(privateNeckCtx)!;
  const guitarBuilderCtx = useGuitarBuilderContext();
  const yPositions = createMemo(()=>props.distancesFromNut.map((d) => -privateCtx.fingerboardHeight() + NUT_FROM_FIRST_FRET + d * FRET_DISTANCE));
  return (
    <Show when={!guitarBuilderCtx || !!guitarBuilderCtx.getSelectedCategoryObj()?.useFret.get()}>
      <For each={yPositions()}>
        {(pos, i) => (
          <Sprite
            zIndex={2}
            anchor={0.5}
            scale={{
              x: 0.49 + Math.log(i() + 1) * 0.035 + (privateCtx.stringCount()! - 6) * 0.07,
              y: 0.49,
            }}
            position={{ x: 0, y: pos }}
            texture={viewportCtx?.textures.fret() ?? Texture.EMPTY}
          />
        )}
      </For>
    </Show>
  );
}

function SelectedItemIndicator(props : {
}) {
  
  //TODO: when hover show the name of item (eg. neck profile) and key (eg. 'c') 
  return (
    <Container>
      <NeckInside/>
      <NeckSide/>
    </Container>
  )
}

function NeckInside(){
  const privateCtx = useContext(privateNeckCtx)!;
  const guitarBuilderCtx = useGuitarBuilderContext();
  const neckProfileExist = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.neckProfile.get() !== undefined);
  const neckProfileMask = createPixiTexture(()=>{
    const neckProfile = guitarBuilderCtx?.getSelectedCategoryObj()?.neckProfile.get();
    if(!neckProfile) return undefined;
    else return Constants.neckProfileMask[neckProfile];
  }, false);
  const fingerboardRadius = createMemo(()=>{
    const radius = guitarBuilderCtx?.getSelectedCategoryObj()?.fingerboardRadius.get();
    if(!radius) return 0;
    else if(radius === 'compound'){
      return 10;
    }else {
      return radius;
    }
  }) 
  const fingerboardEdge = createMemo(()=>{
    const edge = guitarBuilderCtx?.getSelectedCategoryObj()?.fingerboardEdge.get();
    if(!edge) return 0;
    switch(edge){
      case 'square':
        return 0;
      case 'semi' :
        return 2;
      case 'heavy' :
        return 12;
    }
  })

  const woodToMaskScale = createMemo(() => {
    return (neckProfileMask()?.width ?? 1) / (privateCtx.neckWood()?.width ?? 1);
  });

  const [neckMask, setNeckMask] = createSignal<pxSprite>();
  const [fingerboardMask, setFingerboardMask] = createSignal<pxGraphics>();
  return (
    <Show when={neckProfileExist()}>
      <Container position={{ x : privateCtx.neckWidthBottom() + 20, y: -(privateCtx.fingerboardHeight()/2)-50}}>
        <Graphics 
          zIndex={-1}
          draw={[
            ['roundRect', -5, -5, ((neckProfileMask()?.width ?? 80) * (neckProfileMask()?.width ? scaleIntoDesiredWidth(neckProfileMask()!.width, 90) : 1)) + 10, 80, 5],
            ['fill', { color: 0xffffff }],
            ['stroke', { color: 0x000000, width: 2}],
          ]}
        />
        <Text
          position={{
            x : 3 + (privateCtx.isFront() ? 0 : ((neckProfileMask()?.width ?? 80) * (neckProfileMask()?.width ? scaleIntoDesiredWidth(neckProfileMask()!.width, 90) : 1)) + 0),
            y : -80,
          }}
          scale={{
            x : privateCtx.isFront() ? 1 : -1,
            y : 1,
          }}
          style={new TextStyle({
            fontSize: 20,
            align: "center",
          })}
          >
          {"Tampilan\nDalam\nNeck"}
        </Text>
        {/* <Graphics
          position={{ x: 0, y: 40 }}
          zIndex={-1.1}
          draw={[
            ['lineTo', -40, 5],
            ['stroke', { color: 0x000000, width: 2}],
          ]}
        /> */}
        <Container
          mask={fingerboardMask()}
        >
          <Sprite
            texture={privateCtx.fingerboardWood() ?? Texture.EMPTY}
            scale={woodToMaskScale()}
            zIndex={2}
          />
          <Graphics
            draw={[
              ['moveTo', 2, 11],
              ['bezierCurveTo', 2, 11, ((neckProfileMask()?.width ?? 80) * (neckProfileMask()?.width ? scaleIntoDesiredWidth(neckProfileMask()!.width, 90) : 1))/2, (-fingerboardRadius()+12), ((neckProfileMask()?.width ?? 80) * (neckProfileMask()?.width ? scaleIntoDesiredWidth(neckProfileMask()!.width, 90) : 1)), 12],
              ['fill', { color: 0xffffff }],
              ['roundRect', 0, 11 , ((neckProfileMask()?.width ?? 80) * (neckProfileMask()?.width ? scaleIntoDesiredWidth(neckProfileMask()!.width, 90) : 1)) , 7, fingerboardEdge()],
              ['rect', 0, 15, ((neckProfileMask()?.width ?? 80) * (neckProfileMask()?.width ? scaleIntoDesiredWidth(neckProfileMask()!.width, 90) : 1)) , 6],
              ['fill', { color: 0xffffff }],
            ]}
            uses={setFingerboardMask}
            alpha={0}
          />
        </Container>
        <Container
          position={{
            x: 0,
            y: 20,
          }}
          scale={neckProfileMask()?.width ? scaleIntoDesiredWidth(neckProfileMask()!.width, 90) : 1}
          mask={neckMask()}
        >
          <Sprite
            texture={privateCtx.neckWood() ?? Texture.EMPTY}
            scale={woodToMaskScale()}
            zIndex={2}
          />
          <Sprite
            texture={neckProfileMask() ?? Texture.EMPTY}
            zIndex={2.1}
            uses={setNeckMask}
          />
        </Container>
      </Container>
    </Show>
  )
}

function NeckSide(){
  const privateCtx = useContext(privateNeckCtx)!;
  const guitarBuilderCtx = useGuitarBuilderContext();
  const bodyCtx = useGuitarBodyPresenterContext()!;
  const halfNeckBottom = createMemo(()=>privateCtx.neckWidthBottom()/2);

  const [neckMask, setNeckMask] = createSignal<pxSprite>();
  const [fingerboardMask, setFingerboardMask] = createSignal<pxGraphics>();

  const woodToNeckMaskScale = createMemo(() => {
    return (privateCtx.fingerboardHeight() ?? 1) / (privateCtx.neckWood()?.height ?? 1);
  });
  const woodToFingerboardMaskScale = createMemo(() => {
    return (privateCtx.fingerboardHeight() ?? 1) / (privateCtx.fingerboardWood()?.height ?? 1);
  });

  const [woodSprite, setWoodSprite] = createSignal<pxSprite>();

  const yPositions = createMemo(()=>privateCtx.fretDistance().map((d) => -privateCtx.fingerboardHeight() + NUT_FROM_FIRST_FRET + d * FRET_DISTANCE));
  const midYPositions = createMemo(()=>yPositions().map((y, i)=>(y + yPositions()[i-1]) / 2));
  const singleInlayPositions = createMemo(()=>[2, 4, 6, 8, 14, 16, 18, 20].map(i=>midYPositions()[i]));
  const doubleInlayPositions = createMemo(()=>[11, 23].map(i=>midYPositions()[i]));

  const neckColorType = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.neckColorType.get());
  const _neckColor = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.neckColor.get());

  const neckColor = createMemo(()=>{
    if(_neckColor() === undefined) return undefined;
    switch(neckColorType()){
      case 'solid' :
      case 'transparent' : 
        return Colors.solidColors[_neckColor()! as keyof typeof Colors.solidColors].value
      case 'metallic' :
        return Constants.metallicColorUrl[_neckColor()! as keyof typeof Colors.metallicColors]
    }
  });

  createEffect(()=>{
    if(woodSprite() === undefined || !woodSprite()?.texture) return;
    //grayscale the wood when neck color is selected
    if(neckColor()){
      const grayscale = new ColorMatrixFilter();
      grayscale.desaturate();
      woodSprite()!.filters = [grayscale];
    }else{
      woodSprite()!.filters = [];
    }
  })

  const neckTexture = createPixiTexture(()=>typeof neckColor() === 'string' ? neckColor() as string : undefined, false);

  return (
    <Container position={{
      x : (bodyCtx.leftMostPoint()?.x ?? 0) - ((bodyCtx.selectedMask()?.width ?? 0) / 2) * (bodyCtx.scale() ?? 0) - 40,
      y : 0,
    }}>
      {/* 
      <Text
        position={{
          x : 3 + (privateCtx.isFront() ? 0 : ((neckProfileMask()?.width ?? 80) * (neckProfileMask()?.width ? scaleIntoDesiredWidth(neckProfileMask()!.width, 90) : 1)) + 0),
          y : -80,
        }}
        scale={{
          x : privateCtx.isFront() ? 1 : -1,
          y : 1,
        }}
        style={new TextStyle({
          fontSize: 20,
          align: "center",
        })}
        >
        {"Tampilan\nDalam\nNeck"}
      </Text> */}

      <Container
        position={{
          x: - halfNeckBottom(),
          y: 0,
        }}
      >
        {/* Neck */}
        <Container
          mask={neckMask()}
        >
          <Show when={neckColor()}>
            <Show when={typeof neckColor() === 'string'}
              fallback={
                <Graphics
                zIndex={2.1}
                draw={[
                  ['rect', -22, -privateCtx.fingerboardHeight(), 44, privateCtx.fingerboardHeight()],
                  ['fill', neckColor() ?? 0x00000]
                ]}
                alpha={neckColorType() === 'transparent' ? 0.6 : 1}
              />
              }
            >
              <Sprite
                zIndex={2.1}
                anchor={{x:0.5, y:1}}
                texture={neckTexture() ?? Texture.EMPTY}
                scale={(neckTexture()?.height ?? 1)/ privateCtx.fingerboardHeight()}
              />
            </Show>
          </Show>
          <Sprite
            anchor={{ x: 0.5, y: 1 }}
            texture={privateCtx.neckWood() ?? Texture.EMPTY}
            scale={woodToNeckMaskScale()}
            zIndex={2}
            uses={setWoodSprite}
          />
          <Graphics
            draw={[
              ["moveTo", -22 , 0],
              ["lineTo", 22 , 0],
              ["lineTo", 22 , -privateCtx.fingerboardHeight()],
              ["lineTo", -22 , -privateCtx.fingerboardHeight()],
              ["fill", { color: 0xffffff }],
            ]}
            uses={setNeckMask}
            alpha={0}
          />
        </Container>

        {/* Fingerboard */}
        <Container
          position={{
            x : 27,
            y : 0,
          }}
          mask={fingerboardMask()}
        >
          <Sprite
            anchor={{ x: 0.5, y: 1 }}
            texture={privateCtx.fingerboardWood() ?? Texture.EMPTY}
            scale={woodToFingerboardMaskScale()}
            zIndex={2}
          />
          <Graphics
            draw={[
              ["moveTo", -5 , 0],
              ["lineTo", 5 , 0],
              ["lineTo", 5 , -privateCtx.fingerboardHeight()],
              ["lineTo", -5 , -privateCtx.fingerboardHeight()],
              ["fill", { color: 0xffffff }],
            ]}
            uses={setFingerboardMask}
            alpha={0}
          />
        </Container>
        {/* Frets and side dots */}
        <Container
          position={{
            x : 27,
            y : 0,
          }}
        >
          {/* Frets*/}
          <Show when={guitarBuilderCtx?.getSelectedCategoryObj()?.useFret.get()}>
            <Graphics
              zIndex={2}
              draw={[
                ...yPositions().map((y, i)=>['roundRect', 0, y-2.5, 8, 5, 5] as DrawCall),
                ['fill', { color: 0x999999 }],
              ]}
            />
          </Show>
          {/* side dots */}
          <Show when={guitarBuilderCtx?.getSelectedCategoryObj()?.sideInlay.get()}>
            <Graphics
              zIndex={2}
              draw={[
                ...singleInlayPositions().map((y)=>['circle', 0, y, 3] as DrawCall),
                ...(doubleInlayPositions().map((y)=>[
                  ['circle', 0, y - 3, 2.5],
                  ['circle', 0, y + 3, 2.5],
                ] as DrawCall[]).flat()),
                ['fill', { color: guitarBuilderCtx?.getSelectedCategoryObj()?.sideInlay.get() === 'glow-in-the-dark' ?0x56FFE8 : 0xffffff }],
              ]}
              uses={g=>{
                if(guitarBuilderCtx?.getSelectedCategoryObj()?.sideInlay.get() === 'glow-in-the-dark'){
                  g.filters = [
                    new DropShadowFilter({
                      resolution: 2,
                      blur: 4,
                      offset: { x: 0, y: 0 },
                      alpha: 1,
                      color  : 0x56FFE8,
                    }),
                  ];
                }
              }}
            />
          </Show>
        </Container>
      </Container>
    </Container>
  )
}

function Inlay(){
  const privateCtx = useContext(privateNeckCtx)!;
  const offset = 0.1;
  const yPositions = createMemo(()=>privateCtx.fretDistance().map((d,i)=>-privateCtx.fingerboardHeight() + NUT_FROM_FIRST_FRET + d * (FRET_DISTANCE )))
  const midYPositions = createMemo(()=>yPositions().map((y, i)=>((y - yPositions()[i-1]) /2) + y));
  const singleInlayPositions = createMemo(()=>[1, 3, 5, 7, 13, 15, 17, 19].map(i=>midYPositions()[i]));
  const doubleInlayPositions = createMemo(()=>[10, 22].map(i=>midYPositions()[i]));
  const blockWidth = createMemo(()=>privateCtx.neckWidthTop() - 10 );
  return <>
    <Graphics
      draw={[
        ...singleInlayPositions().map((y)=>['circle', 0, y, 3] as DrawCall),
        ...doubleInlayPositions().map(y=>[
          ['circle', 10, y, 3],
          ['circle', -10, y, 3]
        ] as DrawCall[]).flat(),
        ['fill', { color: 0xffffff }],
      ]}
      zIndex={2}
      position={{ x : 0, y:0}}
    />
  </>

  // return <Graphics
  //   draw={[
  //     ...yPositions().filter((_,i)=>[1, 3, 5, 7, 9, 12, 15, 17, 19, 21].some(v=>v === i)).map((y, i)=>['rect', -(blockWidth()/2), y - (yPositions().length-i * 2 ), blockWidth(),2 + (yPositions().length-i * 2 )] as DrawCall),
  //     ['fill', { color: 0xffffff }],
  //   ]}
  //   zIndex={2}
  //   position={{ x : 0, y:0}}
  // />
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
  const [bodyBoundaryMask, setBodyBoundaryMask] = createSignal<pxGraphics>();
  const [renderer, setRenderer] = createSignal<pxContainer>();
  const bodyYPos = createMemo(()=>(renderer() && guitarBodyCtx?.container() && guitarBodyCtx?.neckPosition()) ? renderer()?.toLocal(renderer()!.position, guitarBodyCtx!.container()!).y : undefined);
  createEffect(()=>{
    guitarBodyCtx?.neckPosition()
    bodyYPos()
    setTimeout(()=>renderer()?.emit("maskUpdated"), 300);
  })
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
            { waitMs: 20 }
          );

          const listener = (args: any) => debouncer.call(args);
          c.on("textureGenerated", listener);
          c.on("maskUpdated", listener);
          onCleanup(() => c.off("maskUpdated", listener));
          onCleanup(() => c.off("textureGenerated", listener));
        },
        props.setMaskRenderer,
        setRenderer
      ]}
    >
      <RenderedGraphics
        anchor={{ x: 0.5, y: 1 }}
        draw={[
          ["moveTo", -privateCtx.neckWidthBottom()/2, 0],
          ["lineTo", privateCtx.neckWidthBottom()/2, 0],
          ["lineTo", privateCtx.neckWidthTop()/2, -privateCtx.fingerboardHeight()],
          ["lineTo", -privateCtx.neckWidthTop()/2, -privateCtx.fingerboardHeight()],
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
      <Container
        mask={bodyBoundaryMask()}
      >
        <Graphics
          uses={setBodyBoundaryMask}
          draw={[
            ["moveTo", -200, 0],
            ["lineTo", 200, 0],
            ["lineTo", 200, -privateCtx.fingerboardHeight()],
            ["lineTo", -200, -privateCtx.fingerboardHeight()],
            ["fill", { color: 0xffffff }],
          ]}
          alpha={0}
        />
        <Sprite
          texture={guitarBodyCtx?.selectedMask() ?? Texture.EMPTY}
          scale={guitarBodyCtx?.scale() ?? 1}
          anchor={{ x: 0.5, y: 0.5 }}
          position={{
            x: -(guitarBodyCtx?.neckPosition()?.x ?? 0),
            y: bodyYPos() ?? 0,
          }}
          uses={(s) => {
            s.filters = [invertColorFilter];
          }}
        />
      </Container>
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

function TrussRod(){
  const guitarBuilderCtx = useGuitarBuilderContext();
  const privateCtx = useContext(privateNeckCtx)!;

  const headstockTrussRod = createPixiTexture(()=>Constants.trussRodImage['headstock'], false);
  const spokeWheelTrussRod = createPixiTexture(()=>Constants.trussRodImage['spoke-wheel'], false);
  const doubleTrussRod = createMemo(()=>guitarBuilderCtx?.getSelectedCategoryObj()?.stringCountValue() === 8)
  return <Show when={guitarBuilderCtx?.getSelectedCategoryObj()?.trussRodPosition.get()}>
    {<Switch>
      <Match when={guitarBuilderCtx?.getSelectedCategoryObj()?.trussRodPosition.get() === 'heel'}>
        <Show when={guitarBuilderCtx?.getSelectedCategory() === 'electric'}>
          <Show when={doubleTrussRod()}
            fallback={
              <Graphics
                draw={[
                  ['roundRect', -8, 0, 16, 10, 2],
                  ['fill', { color: 0x000000 }],
                ]}
              />
            }
          >
            <Graphics
              draw={[
                ['roundRect', -12, 0, 24, 10, 2],
                ['fill', { color: 0x000000 }],
              ]}
            />
          </Show>
        </Show>
      </Match>
      <Match when={guitarBuilderCtx?.getSelectedCategoryObj()?.trussRodPosition.get() === 'headstock'}>
        <Show when={doubleTrussRod()}
          fallback={
            <Sprite
              position={{
                x: 0,
                y: -privateCtx.fingerboardHeight() - 20,
              }}
              anchor={{ x: 0.5, y: 1 }}
              texture={headstockTrussRod() ?? Texture.EMPTY}
              scale={0.75}
            />
          }
        >
          <Sprite
            position={{
              x: 15,
              y: -privateCtx.fingerboardHeight() - 20,
            }}
            anchor={{ x: 0.5, y: 1 }}
            texture={headstockTrussRod() ?? Texture.EMPTY}
            scale={0.75}
          />
          <Sprite
            position={{
              x: -15,
              y: -privateCtx.fingerboardHeight() - 20,
            }}
            anchor={{ x: 0.5, y: 1 }}
            texture={headstockTrussRod() ?? Texture.EMPTY}
            scale={0.75}
          />
        </Show>
      </Match>
      <Match when={guitarBuilderCtx?.getSelectedCategoryObj()?.trussRodPosition.get() === 'spoke-wheel'}>
        <Sprite
          zIndex={2.1}
          texture={spokeWheelTrussRod() ?? Texture.EMPTY}
          anchor={{ x : 0.5, y : 1}}
          scale={0.75}
        />
      </Match>
    </Switch>}
  </Show>
}