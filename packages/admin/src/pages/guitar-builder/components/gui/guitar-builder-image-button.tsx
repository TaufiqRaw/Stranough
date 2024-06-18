import { JSX, Show } from "solid-js";
import { Button } from "~/commons/components/button";

export function GuitarBuilderImageButton(props : {
  src ?: string,
  icon ?: () => JSX.Element,
  title ?: string,
  onClick ?: () => void,
  isActive ?: boolean,
  children ?: ()=> JSX.Element,
}){
  return <Button onClick={()=>!props.isActive && props.onClick?.()} class={"relative aspect-square border overflow-hidden !bg-transparent !p-0 flex items-center justify-center " + (props.isActive ? "border-blue-500 border-[3px] cursor-default" : "border-gray-500 hover:!border-gray-200 cursor-pointer")}>
    <Show when={props.src}>
      <img src={props.src} alt={props.title} class="object-cover origin-bottom h-full"/>
    </Show>
    <Show when={props.icon}>
      <div class="h-full items-center justify-center flex">
        {props.icon?.()}
      </div>
    </Show>
    <Show when={props.children}>
    <div class="h-full w-full">
      {props.children?.()}
    </div>
    </Show>
    <div class="absolute bottom-0 bg-black bg-opacity-40 w-full text-xs p-1">
      <span>
        {props.title}
      </span>
    </div>
  </Button>
}