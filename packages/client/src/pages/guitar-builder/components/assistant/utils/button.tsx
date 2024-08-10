import { JSX } from "solid-js"

export function Button(props : {
  onClick? : ()=>void,
  children : JSX.Element | string,
  class ?: string
}){
  return (
    <button
     onClick={props.onClick}
     class={" rounded-md border border-gray-400 hover:border-blue-500 p-2 flex flex-col gap-2 group " + props.class}>
      {props.children}
    </button>
  )
}