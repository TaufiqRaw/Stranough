import { JSX, Show, createEffect, createSignal, getOwner, onCleanup, onMount, runWithOwner } from "solid-js"
import { Portal } from "solid-js/web"
import { useAssistant } from "../_assistant";
import * as R from 'remeda'
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import PointingHandSrc from "~/commons/assets/pointing-hand.svg";

export function WhereToClickAssist(
  props : {
    active : boolean,
    onClick : (e : MouseEvent)=>void,
    children : JSX.Element
  }
){
  const {assistantContainer} = useAssistant()!;
  const {masterContainer, isMobile, isShowAssistant} = useGuitarBuilderContext()!;

  const [position, setPosition] = createSignal<{x:number,y:number}>();
  const [containerWidth, setContainerWidth] = createSignal<number>(0);
  const [containerHeight, setContainerHeight] = createSignal<number>(0);
  const [toClickContainer, setContainer] = createSignal<HTMLDivElement>();

  function callWhenExist(
    exist : ()=>boolean,
    callback : ()=>void
  ){
    if(!exist()){
      setTimeout(()=>callWhenExist(exist,callback),100);
      return;
    }
    callback();
  }
  function setPositionFromContainer(){
    const rect = toClickContainer()?.getBoundingClientRect();
    if(!rect) return;
    setPosition({
      x: rect.x + rect.width/2,
      y: rect.y + rect.height/2
    });
  }

  onMount(()=>{
    // set container width and height
    function setContainerWidthHeight(){
      const rect = toClickContainer()?.getBoundingClientRect();
      if(!rect) return;
      setContainerWidth(rect.width);
      setContainerHeight(rect.height);
    }
    callWhenExist(()=>!!toClickContainer(),()=>setTimeout(setContainerWidthHeight, 200));
    
    if(!toClickContainer()) return;

    function resizeListener(){
      setContainerWidthHeight();
      setPositionFromContainer();
    }
    window.addEventListener('resize',resizeListener);

    onCleanup(()=>{
      window.removeEventListener('resize',resizeListener);
    });
  })

  onMount(()=>{
    const container = assistantContainer();
    
    callWhenExist(()=>!!toClickContainer(),()=>{
      setTimeout(setPositionFromContainer, 200);
    });
    
    if(!container) return;
    const debouncedScrollListener = R.debounce(setPositionFromContainer, {
      waitMs: 10
    });
    container.addEventListener('scroll',debouncedScrollListener.call);

    onCleanup(()=>{
      container.removeEventListener('scroll',debouncedScrollListener.call);
    });
  })

  return <Show
    when={props.active}
    fallback={props.children}
  >
    <div class="animate-helper-glow relative"
      onClick={props.onClick}
      ref={setContainer}
    >
      {props.children}
    </div>
    <Portal
        mount={masterContainer()}
      >
        <Show when={position() && (isMobile() ? isShowAssistant() : true)}>
          <div class={"z-20 absolute transform " + (
                isMobile() ? 'rotate-180' : '-rotate-90'
              )} style={{
            left: `${(position()?.x ?? 0) + 
              (!isMobile() 
              ? ((containerWidth() ?? 0)/2) + 10 
              : - (containerWidth() ?? 0)/2)}px`,
            top: `${(position()?.y ?? 0) - 
              (isMobile() 
              ? ((containerHeight() ?? 0)/2) + 40
              : 20)}px`
          }}>
            <div class="transform animate-hand">
              <img
                src={PointingHandSrc}
                alt="pointing hand"
                class="w-10"
              />
            </div>
          </div>
        </Show>
      </Portal>
  </Show>
}