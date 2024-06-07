import { Accessor, JSX, Setter, Show, createContext, createSignal, onCleanup, useContext } from "solid-js";
import { ToggleableButton } from "./toggleable-button";
import { Portal } from "solid-js/web";
import ToggleableButtonWithState from "./toggleable-button-with-state";
import * as R from "remeda";

type Key = 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'Escape' | 'x';

export function keyboardMove(key : Key, t : number, callback : (speed : {x : number, y :number})=>void){
  const initMove = 5;
    const speed = 0.5;
    const acceleration = 0.01 * (t);
    const directionX = key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : 0;
    const directionY = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;

  callback({x : directionX *  (initMove +  speed * acceleration), y : directionY * (initMove +  speed * acceleration)});
}


const EditorGuiContext = createContext<{
  subMenuContainer: Accessor<HTMLDivElement | undefined>;
}>();

export function EditorGui(props: { 
  children: JSX.Element,
  onKeydown?: (key: Key, t :number) => void;
}) {
  const [sub, setSub] = createSignal<HTMLDivElement | undefined>(undefined);

  if(props.onKeydown){
    let timePressed : number;
    let isHold = false;
    const listener = (e : KeyboardEvent)=>{
      if(isHold){
        !timePressed && (timePressed = e.timeStamp);
        props.onKeydown!(e.key as Key, e.timeStamp - timePressed);
      }else{
        isHold = true;
        props.onKeydown!(e.key as Key, 0);
      }
    };
    const reset = ()=>{
      timePressed = 0;
      isHold = false;
    }
    window.addEventListener("keydown", listener);
    window.addEventListener("keyup", reset);
    onCleanup(() => {
      window.removeEventListener("keydown", listener);
      window.removeEventListener("keyup", reset);
    });
  }

  return <div class="relative h-screen flex">
      <div class=" absolute left-0 transform -translate-x-[15.5rem] top-[1vh]" ref={setSub}>

      </div>
      <div class=" bg-gray-900 py-3 text-white-950 flex flex-col h-full overflow-y-auto w-[15rem] relative z-[1]">
        <EditorGuiContext.Provider value={{subMenuContainer : sub}}>
          {props.children}
        </EditorGuiContext.Provider>
      </div>
    </div>
}

export function EditorGuiGroup(props: { children: JSX.Element; parent?: boolean, class ?:string }) {
  return (
    <div
      class={
        "px-3 flex flex-col gap-2 border-t-gray-500 border-t py-3 last:border-b-gray-500 last:border-b " + props.class + " " +
        (props.parent ? "" : "bg-gray-800")
      }
    >
      {props.children}
    </div>
  );
}

export function EditorGuiSubMenu(props : {
  title : JSX.Element | string,
  children : JSX.Element,
  onClick : () => void
  isActive : boolean,
  isExist ?: boolean,
  onReset ?: () => void
}){
  const {subMenuContainer} = useContext(EditorGuiContext)!;

  return <>
  <ToggleableButtonWithState
    isFocus={props.isActive}
    isActive={props.isExist ?? false}
    onClick={props.onClick}
    onReset={props.onReset}
  >
    {props.title}
  </ToggleableButtonWithState>
  <Portal mount={subMenuContainer()}>
    <Show when={props.isActive}>
      <div class="bg-gray-900 flex-col gap-2 text-white rounded-lg overflow-y-auto relative w-[15rem] h-[98vh]">
        {props.children}
      </div>
    </Show>
  </Portal>
  </>
}