import { JSX } from "solid-js"

export function Header(
  props : {
    children : JSX.Element | string
  }
){
  return <div class="w-full bg-gray-700 rounded-sm p-2">
    {props.children}
  </div>
}