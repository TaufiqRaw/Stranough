import { Application, Assets, Container, Graphics, RenderedGraphics, useApplication } from "solid-pixi";
import {Accessor, Component, JSX, Setter, Show, createContext, createEffect, createMemo, createSignal, mergeProps, onCleanup, onMount, useContext} from 'solid-js'
import { Color, ContainerChild, Graphics as pxGraphics, Container as pxContainer, Application as pxApplication, Texture, FederatedPointerEvent} from "pixi.js";
import { createResizeObserver } from "@solid-primitives/resize-observer";
import { ViewportContextType } from "../interfaces/common-context-type";
import { createSignalObject } from "../functions/signal-object.util";
import { ToggleableButton, ToggleableButtonProps } from "./toggleable-button";
import { SignalObject } from "../interfaces/signal-object";

const ViewportCtx = createContext<ViewportContextType<'target' | 'defaultWood' | 'fret'>>();

const MIN_SCALE = 0.2;
const MAX_SCALE = 2;
const DEFAULT_X = 0;
const DEFAULT_SCALE = 0.5;

export const useViewportContext = ()=>{
  return useContext(ViewportCtx);
}

export function Viewport(props : {
  children ?: JSX.Element,
  childrenBack ?: JSX.Element,
  allowZoom ?: boolean,
  allowMove ?: boolean,
  displayCenterIndicator ?: boolean,
  background ?: number,
  btnPositionClass ?: string,
  menuOpened ?: Accessor<boolean>,
}) {
  const [appContainer, setAppContainer] = createSignal<HTMLDivElement | null>(
    null
  );
  const [screenWidth, setScreenWidth] = createSignal<number>(0);
  const [screenHeight, setScreenHeight] = createSignal<number>(0);
  const [app, setApp] = createSignal<pxApplication | null>(null);
  const isFront = createSignalObject<boolean>(true);
  const [scaler, setScaler] = createSignal<Setter<number>>();
  const [getScale, setScaleGetter]= createSignal<Accessor<number>>();

  onMount(() => {
    createResizeObserver(appContainer, ({ width, height }, el) => {
      if(!!width && !!height){
        setScreenWidth(width);
        setScreenHeight(height);
        app()?.renderer.resize(width, height);
        if (!app()) {
          function timeout(){
            if(!app())
              setTimeout(timeout, 100);
            else{
              app()!.renderer.resize(width, height);
              app()!.canvas.style.width = width + "px";
              app()!.canvas.style.height = height + "px";
            }
          }
          timeout();
        }else{
          app()!.renderer.resize(width, height);
          app()!.canvas.style.width = width + "px";
          app()!.canvas.style.height = height + "px";
        }
      }
    });
  });

return <div class="relative h-full bg-inherit" ref={setAppContainer}>
  <div class="absolute left-5 top-5 md:hidden z-10 flex flex-col gap-2">
    <div class="shadow-lg ">
      <div class={(isFront.get() ? "bg-blue-500 text-white" : "bg-white border-blue-500 border-2 text-blue-500 cursor-pointer") + " rounded-t-md p-2"}
        onClick={()=>isFront.set(true)}
      >
        Depan
      </div>
      <div class={(isFront.get() ? "bg-white border-blue-500 border-2 text-blue-500 cursor-pointer" : "bg-blue-500 text-white") + " rounded-b-md p-2"}
        onClick={()=>isFront.set(false)}
      >
        Belakang
      </div>
    </div>
    <div class="text-blue bg-white border-2 border-blue-500 rounded-md flex flex-col lg:hidden items-center">
      <i class="bi bi-zoom-in text-blue-500"></i>
      <input 
        type="range"
        min="0.2" 
        max="2" 
        step="0.01" 
        value={getScale()?.() ?? DEFAULT_SCALE} 
        class="w-20 -rotate-90 h-24" 
        onInput={(e)=>scaler()?.(parseFloat((e.target as HTMLInputElement).value))}
      />
    </div>
  </div>
  <Show when={appContainer()}>
      <div class="absolute">
        {/*<div class={"absolute flex " + (props.btnPositionClass ?? "left-12 top-2")}>
          <ToggleableButton
            class={"w-20 h-10 z-[1] !rounded-r-none"}
            inactiveClass="!bg-white !border-blue-500 !text-blue-500"
            activeClass="!bg-blue-500 !border-blue-500 !text-white"
            isActive={isFront.get()}
            onClick={() => isFront.set(true)}
          >
            Front
          </ToggleableButton>
          <ToggleableButton
            class={"w-20 h-10 z-[1] !rounded-l-none"}
            inactiveClass="!bg-white !border-blue-500 !text-blue-500"
            activeClass="!bg-blue-500 !border-blue-500 !text-white"
            isActive={!isFront.get()}
            onClick={() => isFront.set(false)}
          >
            Back
          </ToggleableButton>
        </div> */}
      <Application
        background={props.background ?? 0xffffff}
        antialias
        uses={setApp}
        resolution={2}
        backgroundColor={new Color()}
      >
        <VContainer
          isFront={screenWidth() < 768 ? isFront.get() : true}
          allowMove={props.allowMove}
          allowZoom={props.allowZoom}
          displayCenterIndicator={props.displayCenterIndicator}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          dualView={screenWidth() > 768}
          menuOpened={props.menuOpened}
          setScaler={setScaler}
          setScaleGetter={setScaleGetter}
        >
          <Assets
            load={[["/assets/alder.jpg", "/assets/target.png"]]}
          >
            {props.children}
          </Assets>
        </VContainer>
        <Show
          when={screenWidth() > 768}
        >
          <Graphics
            x={screenWidth() / 2}
            zIndex={1}
            draw={[['rect', 0, 0, 10, screenHeight()], ['fill', 0xd1d5db]]}
          />
          <VContainer
            x={screenWidth() / 2}
            isFront={false}
            allowMove={props.allowMove}
            allowZoom={props.allowZoom}
            displayCenterIndicator={props.displayCenterIndicator}
            screenHeight={screenHeight}
            screenWidth={screenWidth}
            dualView={true}
          >
            <Assets
              load={[["/assets/alder.jpg", "/assets/target.png"]]}
            >
              {props.childrenBack ?? props.children}
            </Assets>
          </VContainer>
        </Show>
      </Application>
      </div>
  </Show>
</div>
};

function VContainer(_props : {
  children ?: JSX.Element,
  screenHeight : Accessor<number>,
  screenWidth : Accessor<number>,
  isFront : boolean,
  allowZoom ?: boolean,
  allowMove ?: boolean,
  displayCenterIndicator ?: boolean,
  x ?: number,
  dualView ?: boolean,
  menuOpened ?: Accessor<boolean>,
  setScaler ?: Setter<Setter<number> | undefined>,
  setScaleGetter ?: Setter<Accessor<number> | undefined>,
}) {
  const props = mergeProps({allowZoom : true, allowMove : true, displayCenterIndicator : true}, _props);
  const app = useApplication();
  if(!app) throw new Error('Viewport must be a child of Application');

  const [x, setX] = createSignal(DEFAULT_X);
  const [y, setY] = createSignal<number>();
  const [scale, setScale] = createSignal(DEFAULT_SCALE);
  const [mask, setMask] = createSignal<pxGraphics | null>(null);

  onMount(()=>{
    if(props.dualView)
      return;
    props.setScaler?.(()=>setScale);
    props.setScaleGetter?.(()=>scale);
  })

  const defaultY = createMemo(()=>props.screenHeight() / 2);

  return <Container
    x={props.x ?? 0}
    interactive
    pointerdown={(e : FederatedPointerEvent)=>{
      let lastX = e.clientX;
      let lastY = e.clientY;

      let move = (e : MouseEvent)=>{
        let dx = e.clientX - lastX;
        let dy = e.clientY - lastY;
        setX(x=>x - dx / (scale()));
        setY(y=>((y ?? defaultY()) - dy / (scale())));
        lastX = e.clientX;
        lastY = e.clientY;
      }

      let up = ()=>{
        app.canvas.removeEventListener('pointermove', move);
        app.canvas.removeEventListener('pointerup', up);
      }
      app.canvas.addEventListener('pointermove', move);
      app.canvas.addEventListener('pointerup', up);}
    }
    onwheel={e=>{
      setScale(s=>Math.max(
        MIN_SCALE, 
        Math.min(
          MAX_SCALE,
          s - e.deltaY * 0.01
        )
      ));
    }}
    mask={mask()}
  >
    <Graphics
      uses={setMask}
      draw={[
        ['rect', 0, 0, props.screenWidth()/(props.dualView ? 2 : 1), props.screenHeight()],
        ['fill', 0xe2e8f0],
      ]}
    />
    <Container
      position={{x :props.screenWidth()/(props.dualView ? 4 : 2), y : props.screenHeight()*(
        (props.menuOpened?.()) ? 0.15 : 0.5
      )}}
    >
      <Container
        pivot={{ x: x(), y: y() ?? defaultY() }}
        scale={props.allowZoom ? scale() : 1}
        interactive
      >
        <Show when={props.displayCenterIndicator}>
          <CenterIndicator x={x} y={()=>(y() ?? defaultY())} scale={props.allowZoom ? scale : ()=>1}/>
        </Show>
        <ViewportCtx.Provider value={{
          isFront : {get:()=>props.isFront},
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
            <Container zIndex={0} position={{
              x : 0,
              y : props.screenHeight()
            }}>
              {props.children}
            </Container>
          </Assets>
        </ViewportCtx.Provider>
        <Show when={props.displayCenterIndicator}>
          <CenterIndicator fillColor={0xffffff} x={x} y={()=>(y()??defaultY())} scale={props.allowZoom ? scale : ()=> 1} alpha={0.2} zIndex={1}/>
        </Show>
      </Container>
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