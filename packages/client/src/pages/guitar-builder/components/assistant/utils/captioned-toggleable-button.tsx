import { ToggleableButton } from "~/commons/components/toggleable-button";
import { Button } from "./button";

export function CaptionedToggleableButton(props : {
  title : string,
  caption : string,
  isActive : boolean,
  onClick? : (e : MouseEvent)=>void,
}){
  return <ToggleableButton 
    onClick={props.onClick || (()=>{})}
    isActive={props.isActive}
    class="flex flex-col gap-2 p-2"
  >
  { (isActive : boolean) => <>
    <div>
    {props.title}
    </div>
    <div class={"border border-l-4 p-2 text-gray-300 " + (isActive 
      ? "border-blue-500"
      : "group-hover:border-white border-gray-500"
    )} >
      {props.caption}
    </div>
  </>
  }
</ToggleableButton>
}