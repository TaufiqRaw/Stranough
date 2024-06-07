import { Application, Assets, Container, Graphics, RenderedGraphics, useApplication } from "solid-pixi";
import {Accessor, JSX, Show, createContext, createEffect, createSignal, mergeProps, onCleanup, onMount, useContext} from 'solid-js'
import { Color, ContainerChild, Graphics as pxGraphics, Container as pxContainer, Application as pxApplication, Texture} from "pixi.js";
import { createResizeObserver } from "@solid-primitives/resize-observer";
import { ViewportContextType } from "../interfaces/common-context-type";
import { createSignalObject } from "../functions/signal-object.util";
import { ToggleableButton } from "./toggleable-button";
import { SignalObject } from "../interfaces/signal-object";

const ViewportCtx = createContext<ViewportContextType<'target' | 'defaultWood' | 'fret'>>();

const MIN_SCALE = 0.2;
const MAX_SCALE = 2;

export const useViewportContext = ()=>{
  return useContext(ViewportCtx);
}

export function Viewport(props : {
  children ?: JSX.Element,
  allowZoom ?: boolean,
  allowMove ?: boolean,
  displayCenterIndicator ?: boolean,
  background ?: number,
}) {
  const [appContainer, setAppContainer] = createSignal<HTMLDivElement | null>(
    null
  );
  const [screenWidth, setScreenWidth] = createSignal<number>(0);
  const [screenHeight, setScreenHeight] = createSignal<number>(0);
  const [app, setApp] = createSignal<pxApplication | null>(null);
  const isFront = createSignalObject<boolean>(true);

  onMount(() => {
    createResizeObserver(appContainer, ({ width, height }, el) => {
      setScreenWidth(width);
      setScreenHeight(height);
      app()?.renderer.resize(width, height);
      if (!app()) return;
      app()!.canvas.style.width = width + "px";
      app()!.canvas.style.height = height + "px";
    });
  });
return <div class="relative h-full bg-inherit" ref={setAppContainer}>
  <Show when={appContainer()}>
      <div class="absolute">
      <ToggleableButton
        class="absolute left-12 top-2 w-20 h-10 z-[1] bg-blue-300 text-white !border-blue-500"
        activeClass="!bg-blue-500"
        isActive={isFront.get()}
        onClick={() => isFront.set(!isFront.get())}
      >
        Front
      </ToggleableButton>
      <Application
        background={props.background ?? 0xffffff}
        antialias
        uses={setApp}
        resolution={1.5}
        backgroundColor={new Color()}
      >
        <VContainer
          isFront={isFront}
          allowMove={props.allowMove}
          allowZoom={props.allowZoom}
          displayCenterIndicator={props.displayCenterIndicator}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
        >
          <Assets
            load={[["/assets/alder.jpg", "/assets/target.png"]]}
          >
            {props.children}
          </Assets>
        </VContainer>
      </Application>
      </div>
  </Show>
</div>
};

function VContainer(_props : {
  children ?: JSX.Element,
  screenHeight : Accessor<number>,
  screenWidth : Accessor<number>,
  isFront : SignalObject<boolean>,
  allowZoom ?: boolean,
  allowMove ?: boolean,
  displayCenterIndicator ?: boolean,
}) {
  const props = mergeProps({allowZoom : true, allowMove : true, displayCenterIndicator : true}, _props);
  const app = useApplication();
  if(!app) throw new Error('Viewport must be a child of Application');

  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [scale, setScale] = createSignal(1);

  const canvasPointerDownHandler = (e: PointerEvent)=>{

    let lastX = e.clientX;
    let lastY = e.clientY;

    let move = (e : MouseEvent)=>{
      let dx = e.clientX - lastX;
      let dy = e.clientY - lastY;
      setX(x=>x - dx / scale());
      setY(y=>y - dy / scale());
      lastX = e.clientX;
      lastY = e.clientY;
    }

    let up = ()=>{
      app.canvas.removeEventListener('pointermove', move);
      app.canvas.removeEventListener('pointerup', up);
    }
    app.canvas.addEventListener('pointermove', move);
    app.canvas.addEventListener('pointerup', up);
  }

  const canvasWheelHandler = (e : WheelEvent)=>{

    setScale(s=>Math.max(
      MIN_SCALE, 
      Math.min(
        MAX_SCALE,
        s - e.deltaY * 0.01
      )
    ));
  }

  props.allowMove && app.canvas.addEventListener('pointerdown', canvasPointerDownHandler);
  props.allowZoom && app.canvas.addEventListener('wheel', canvasWheelHandler);

  onCleanup(()=>{
    app.canvas.removeEventListener('pointerdown', canvasPointerDownHandler);
    app.canvas.removeEventListener('wheel', canvasWheelHandler);
  })
  return <Container
    x={props.screenWidth() / 2}
    y={props.screenHeight() / 2}
  >
    <Container
      pivot={{ x: x(), y: y() }}
      scale={props.allowZoom ? scale() : 1}
    >
      <Show when={props.displayCenterIndicator}>
        <CenterIndicator x={x} y={y} scale={props.allowZoom ? scale : ()=>1}/>
      </Show>
      <ViewportCtx.Provider value={{
        isFront : props.isFront,
        screenHeight : props.screenHeight,
        screenWidth : props.screenWidth,
        textures : {
          defaultWood : ()=>Texture.from('/assets/alder.jpg'),
          target : ()=>Texture.from('/assets/target.png'),
          fret : ()=>Texture.from('/assets/fret.png')
        }}}>
        <Assets
          load={[["/assets/alder.jpg", "/assets/target.png", "/assets/fret.png"]]}
        >    
          <Container zIndex={0}>
            {props.children}
          </Container>
        </Assets>
      </ViewportCtx.Provider>
      <Show when={props.displayCenterIndicator}>
        <CenterIndicator fillColor={0xffffff} x={x} y={y} scale={props.allowZoom ? scale : ()=> 1} alpha={0.2} zIndex={1}/>
      </Show>
    </Container>
  </Container>
}

function CenterIndicator(_props : {
  x : Accessor<number>,
  y : Accessor<number>,
  scale : Accessor<number>,
  alpha ?: number,
  zIndex ?: number,
  fillColor ?: number,
}){
  const props = mergeProps({alpha : 1, zIndex : 0, fillColor : 0xff0000}, _props);
  const [centerIndicatorMask, setCenterIndicatorMask] = createSignal<pxGraphics>()

  return <Container
  zIndex={props.zIndex}
  scale={1/props.scale()}
  x={props.x()}
  y={props.y()}
  alpha={props.alpha}
>
  <Graphics
    draw={[
      ['circle', 0, 0, 6],
      ['stroke', {
        color : new Color(props.fillColor),
        width : 3
      }],
    ]}
  />
  <Container
    mask={centerIndicatorMask()}
  >
    <Graphics
      draw={[
        ['circle', 0, 0, 4.5],
        ['fill', {
          color : new Color(props.fillColor),
        }],
      ]}
    />
    <Graphics 
      scale={{x : 1, y : -1}}
      uses={setCenterIndicatorMask}
      draw={[
        ['rect', -10, -5, 20, 10 * ((props.scale()-MIN_SCALE) / (MAX_SCALE-MIN_SCALE))],
        ['fill', 0xffffff]
      ]}
    >

    </Graphics>
  </Container>
</Container>
}