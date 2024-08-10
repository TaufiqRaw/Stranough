import { JSX, mergeProps } from "solid-js";
const typeToTWColor = {
  info : 'border-blue-500',
  warning : 'border-yellow-500',
  error : 'border-red-500',
  recommended : 'border-green-500',
}

export function Caption(_props :{
  type ?: keyof typeof typeToTWColor,
  class ?: string,
  children : JSX.Element | string,
  onClick? : ()=>void,
}){
  const props = mergeProps({type : 'info' as const}, _props)
  return <div onclick={props.onClick} class={"border border-l-4 p-2 flex flex-col gap-2 " + typeToTWColor[props.type] + " " + props.class } >
    {props.children}
  </div>
}