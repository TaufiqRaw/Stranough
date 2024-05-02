import { Component, JSX} from "solid-js";

export default function BottomMenuItem (props : {
  caption : string,
  Icon : Component<JSX.SvgSVGAttributes<SVGSVGElement>>,
  active? : boolean,
  onClick?: () => void
}) {
  return <div onClick={props.onClick} class={'item w-full relative h-20 py-5 ' + (props.active ? 'active': '')}>
    <props.Icon/>
    <div class='text-white absolute w-full flex justify-center caption'>
        <div class='text-sm'>{props.caption}</div>
    </div>
  </div>
}