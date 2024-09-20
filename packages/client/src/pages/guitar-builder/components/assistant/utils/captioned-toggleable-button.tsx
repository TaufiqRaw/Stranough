import { ToggleableButton } from "~/commons/components/toggleable-button";
import { Button } from "./button";

export function CaptionedToggleableButton(props : {
  title : string,
  caption : string,
  isActive : boolean,
  onClick? : (e : MouseEvent)=>void,
  ref ?: any
}){
  return <ToggleableButton 
    onClick={props.onClick || (()=>{})}
    isActive={props.isActive}
    class="flex flex-col gap-2 p-2"
    activeClass="bg-blue-900"
    ref={props.ref}
  >
  { (isActive : boolean) => <>
    <div class={isActive 
      ? "text-gray-100" 
      : "text-gray-300 group-hover:text-gray-200"}>
    {props.title}
    </div>
    <div class={"border border-l-4 p-2 " + (isActive 
      ? "border-blue-500 text-gray-200"
      : "group-hover:border-white border-gray-500 text-gray-400 group-hover:text-gray-200"
    )} >
      {props.caption}
    </div>
  </>
  }
</ToggleableButton>
}