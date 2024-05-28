import { Accessor, JSX, Setter, Show, createContext, createSignal, useContext } from "solid-js";
import { ToggleableButton } from "./toggleable-button";
import { Portal } from "solid-js/web";
import ToggleableButtonWithState from "./toggleable-button-with-state";

const EditorGuiContext = createContext<{
  subMenuContainer: Accessor<HTMLDivElement | undefined>;
}>();

export function EditorGui(props: { children: JSX.Element }) {
  const [sub, setSub] = createSignal<HTMLDivElement | undefined>(undefined);
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