import { Viewport } from "~/commons/components/viewport";
import { GuitarBuilderPresenter } from "./guitar-builder.presenter";
import { Accessor, For, Show, createContext, createEffect, createMemo, createResource, createSignal, getOwner, on, onCleanup, onMount, useContext } from "solid-js";
import { IGuitarBuilder, SelectedItemAsObj, selectedItemVirtuals } from "./utils/types";
import { createGuitarComponent } from "./utils/create-guitar-component";
// import GuitarBuilderGui from "./components/gui/guitar-builder-gui";
import { Assistant } from "./components/assistant/_assistant";
import { createResizeObserver } from "@solid-primitives/resize-observer";
import { PriceTag } from "./components/utils/price-tag";
import { Button } from "~/commons/components/button";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import * as R from 'remeda';
import { useParams } from "@solidjs/router";
import { ServerDtos, ServerEntities } from "stranough-server";
import { GuitarBuilder as CGuitarBuilder } from "stranough-common";
import { bridgeRepository } from "../admin/bridge-editor/bridge.repository";
import { pickupRepository } from "../admin/pickup-editor/pickup.repository";
import { electricModelRepository } from "../admin/electric-model-editor/electric-model.repository";
import { headstockRepository } from "../admin/headstock-editor/headstock.repository";
import { knobRepository } from "../admin/knob-editor/knob.repository";
import { nutRepository } from "../admin/nut-editor/nut.repository";
import { pegRepository } from "../admin/peg-editor.ts/peg.repository";
import { axios } from "~/commons/axios-instance";
import { Texture } from "pixi.js";
import { pickguardRepository } from "../admin/pickguard-editor/pickguard.repository";

const MOBILE_BREAKPOINT = 1024;

export const GuitarBuilderCtx = createContext< IGuitarBuilder & {
  masterContainer : Accessor<HTMLDivElement | undefined>,
  isMobile : Accessor<boolean>,
  isShowAssistant : Accessor<boolean>,
  setAssistMsg : (msg : {
    onNextButtonClick ?: ()=>void,
    message : string,
    allowClickOutside ?: boolean
  })=>void,
  clearAssistMsg : ()=>void,
  setExplanation : (msg : {
    message : string,
    videoSrc ?: string[],
    imageSrc ?: string[],
  })=>void,
  clearExplanation : ()=>void,
  changeSaved : Accessor<boolean>,
  saveGuitar : ()=>Promise<void>,
} | undefined>();

export function GuitarBuilder(){
  const params = useParams();
  const rawId = params.id;
  const id = parseInt(params.id);
  const owner = getOwner()!;
  const [data] = createResource(async ()=>{
    if(rawId === 'new') return undefined;
    else if(isNaN(id)) return undefined;
    const res = await axios.get<ServerEntities.Order>(`/orders/${id}`);
    return res.data;
  })
  const [dataWithItems] = createResource(data, async(item)=>{
    const ids = R.pick(item.selectedItems.electric, CGuitarBuilder.mustImplementLabel);
    const data = await Promise.all(R.pipe(
      R.entries.strict(ids),
      R.filter(([k,v])=>v !== undefined),
      R.map(async ([k,v])=>{
        switch(k){
          case 'bridge' : {
            return [k,await bridgeRepository.get(v, {owner})] as const;
          }
          case 'bridge2' : {
            return [k,await bridgeRepository.get(v, {owner})] as const;
          }
          case 'bridgePickup' : {
            return [k,await pickupRepository.get(v, {owner})] as const;
          }
          case 'neckPickup' : {
            return [k,await pickupRepository.get(v, {owner})] as const;
          }
          case 'middlePickup' : {
            return [k,await pickupRepository.get(v, {owner})] as const;
          }
          case 'guitarModel' : {
            return [k,await electricModelRepository.get(v, {owner})] as const;
          }
          case 'headstock' : {
            return [k,await headstockRepository.get(v, {owner})] as const;
          }
          case 'knob' : {
            return [k,await knobRepository.get(v, {owner})] as const;
          }
          case 'nut' : {
            return [k,await nutRepository.get(v, {owner})] as const;
          }
          case 'peg' : {
            return [k,await pegRepository.get(v, {owner})] as const;
          }
          case 'pickguard' : {
            return [k,await pickguardRepository.get(v, {owner})] as const;
          }
        }
      }),
    ),
  )
    
    return {
      ...item.selectedItems,
      electric : {
        ...R.omit(item.selectedItems.electric, CGuitarBuilder.mustImplementLabel),
        ...R.fromEntries.strict(data),
      },
    }
  })
  return <Show when={(dataWithItems() && data()) || rawId === 'new' || isNaN(id)}
    fallback={<div>Loading...</div>}
  >
    <_GuitarBuilder items={dataWithItems()} orderDetail={data()} id={id}/>
  </Show>
}

function _GuitarBuilder(props : {
    id ?: number,
    items ?: SelectedItemAsObj,
    feedback ?: string,
    orderDetail ?: ServerEntities.Order 
}){
  const guitarComponent = createGuitarComponent(props.items);
  const [screenHeight, setScreenHeight] = createSignal<number>();
  const [isMobile, setIsMobile] = createSignal<boolean>(false);
  const [masterContainer, setMasterContainer] = createSignal<HTMLDivElement>();
  const [onSave, setOnSave] = createSignal<()=>Promise<void>>();
  const [assistMsg, setAssistMsg] = createSignal<{
    onNextButtonClick ?: ()=>void,
    message : string,
    allowClickOutside ?: boolean
  }>();
  const [explanation, setExplanation] = createSignal<{
    message : string,
    videoSrc ?: string[],
    imageSrc ?: string[],
  }>();
  const changeSaved = createSignalObject<boolean>(props.id == undefined);

  function clearExplanation(){
    setExplanation(undefined);
  }

  function clearAssistMsg(){
    setAssistMsg(undefined);
  }

  async function saveGuitar(){
    await onSave()?.();
    changeSaved.set(true);
  }

  createEffect(on(R.pipe(
    R.entries.strict(
      R.omit(guitarComponent.electric, selectedItemVirtuals)
    ),
    R.map(([k,v])=>v.get)
  ), ()=>{
    changeSaved.set(false);
  }))

  onMount(() => {
    function windowResizeListener(){
      setScreenHeight(window.innerHeight);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }
    windowResizeListener();
    window.addEventListener('resize', windowResizeListener);
    onCleanup(()=>{
      window.removeEventListener('resize', windowResizeListener);
    });
  });

  const [frontRender, setFrontRender] = createSignal<any>();
  const [backRender, setBackRender] = createSignal<any>();

  const [showMenu, setShowMenu] = createSignal<boolean>(true);
  const isMenuOpened = createMemo(()=>isMobile() && showMenu());
  return (
    <div class="relative overflow-hidden flex" style={{
      height: screenHeight() + 'px'
    }}
      ref={setMasterContainer}
    >
      <GuitarBuilderCtx.Provider value={{...guitarComponent, masterContainer, isMobile, setAssistMsg, clearAssistMsg, isShowAssistant : showMenu, clearExplanation, setExplanation, changeSaved : changeSaved.get, saveGuitar}}>
        <div class={"absolute bottom-0 left-0 lg:relative lg:w-80 h-[50vh] lg:h-screen w-full z-10 transform lg:translate-y-0 transition-transform duration-100 " + (
          showMenu() ? 'translate-y-0' : 'translate-y-full'
        )}>
          <div class="relative h-full">
            <div class="lg:w-64 w-full flex flex-col gap-2 lg:min-h-32 absolute lg:top-2 lg:bottom-0 lg:left-[100%] left-0 bottom-[100%] pointer-events-none">
                <Show when={explanation() && (isMenuOpened() || !isMobile())}>  
                  <div class="px-2 lg:p-0 flex gap-3 lg:block">
                    <div class="w-28 "/>
                    <div class="rounded-md bg-gray-800 flex-1 shadow-md p-2 text-white-950 flex flex-col gap-2 overflow-y-auto lg:max-h-none">  
                      <For each={explanation()!.videoSrc}>
                        {(src)=><video src={src} autoplay loop></video>}
                      </For>
                      <For each={explanation()!.imageSrc}>
                        {(src)=><img src={src} class="w-full object-cover"/>}
                      </For>
                      <div class="" innerHTML={explanation()?.message}/>
                    </div>
                  </div>
                </Show>
                <Show when={assistMsg()}>
                  <div class="px-2 lg:p-0 flex gap-3 lg:block">
                    <div class="w-28 "/>
                    <div class="rounded-md bg-blue-200 border flex-1 border-blue-500 shadow-md p-2 text-blue-500 flex flex-col gap-2 overflow-y-auto max-h-32 lg:max-h-none">  
                      <i class="bi bi-info-square text-2xl lg:-mb-2"></i>
                      <div class="" innerHTML={assistMsg()!.message}/>
                    </div>
                  </div>
                </Show>
            </div>
            <div class="lg:hidden absolute left-2 bottom-[100%]">
              <button class="bg-blue-500 text-white p-2 w-28 rounded-md" onClick={()=>setShowMenu(!showMenu())}>
                {showMenu() ? 'Tutup' : 'Buka'} Menu
              </button>
            </div>
            {/* <GuitarBuilderGui/> */}
            <Assistant 
              orderDetail={props.orderDetail} 
              setOnSave={setOnSave} 
              id={props.id}
              renderFront={frontRender}
              renderBack={backRender}
            />
          </div>
        </div>
        <div class="flex-1">
          <Viewport
            menuOpened={isMenuOpened}
            displayCenterIndicator={false}
            btnPositionClass="left-80 top-3"
            childrenBack={<GuitarBuilderPresenter
              setOnRender={setBackRender}
            />}
          >
            <GuitarBuilderPresenter
              setOnRender={setFrontRender}
            />
          </Viewport>
        </div>
        <div class="absolute right-2 top-2 flex lg:flex-col flex-row gap-2">
          <PriceTag/>
        </div>
      </GuitarBuilderCtx.Provider>
    </div>
  )
}

export function useGuitarBuilderContext(){
  return useContext(GuitarBuilderCtx);
}