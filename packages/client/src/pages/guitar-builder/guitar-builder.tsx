import { Viewport } from "~/commons/components/viewport";
import { GuitarBuilderPresenter } from "./guitar-builder.presenter";
import { Accessor, createContext, createSignal, getOwner, onCleanup, onMount, useContext } from "solid-js";
import { IGuitarBuilder } from "./utils/types";
import { createGuitarComponent } from "./utils/create-guitar-component";
// import GuitarBuilderGui from "./components/gui/guitar-builder-gui";
import { Assistant } from "./components/assistant/_assistant";
import { createResizeObserver } from "@solid-primitives/resize-observer";
import { PriceTag } from "./components/utils/price-tag";

const GuitarBuilderCtx = createContext< IGuitarBuilder | undefined>();

export function GuitarBuilder(){
  const guitarComponent = createGuitarComponent();
  const [screenHeight, setScreenHeight] = createSignal<number>();

  onMount(() => {
    setScreenHeight(window.innerHeight);
    const windowResizeListener = ()=>{
      setScreenHeight(window.innerHeight);
    }
    window.addEventListener('resize', windowResizeListener);
    onCleanup(()=>{
      window.removeEventListener('resize', windowResizeListener);
    });
  });


  const [showMenu, setShowMenu] = createSignal<boolean>(false);
  return (
    <div class="relative overflow-hidden flex" style={{
      height: screenHeight() + 'px'
    }}>
      <GuitarBuilderCtx.Provider value={{...guitarComponent}}>
        <div class={"absolute bottom-0 left-0 lg:relative lg:w-80 h-[50vh] lg:h-screen w-full z-10 transform lg:translate-y-0 transition-transform duration-100 " + (
          showMenu() ? 'translate-y-0' : 'translate-y-full'
        )}>
          <div class="relative h-full">
            <div class="lg:hidden absolute left-2 bottom-[100%]">
              <button class="bg-blue-500 text-white p-2" onClick={()=>setShowMenu(!showMenu())}>
                {showMenu() ? 'Tutup' : 'Buka'} Menu
              </button>
            </div>
            {/* <GuitarBuilderGui/> */}
            <Assistant/>
          </div>
        </div>
        <div class="flex-1">
          <Viewport
            menuOpened={showMenu}
            displayCenterIndicator={false}
            btnPositionClass="left-80 top-3"
          >
            <GuitarBuilderPresenter/>
          </Viewport>
        </div>
        <PriceTag/>
      </GuitarBuilderCtx.Provider>
    </div>
  )
}

export function useGuitarBuilderContext(){
  return useContext(GuitarBuilderCtx);
}