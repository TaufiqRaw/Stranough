import { JSX } from "solid-js"

export function Header(
  props : {
    children : JSX.Element | string
  }
){
  return <div class="w-[calc(1rem+100%)] py-2 px-4 border-b border-t -mx-2 bg-gray-700 border-gray-500 text-center font-bold mb-2">
    {props.children}
  </div>
}