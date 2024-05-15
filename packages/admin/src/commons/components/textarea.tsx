import { JSX } from "solid-js";

export function Textarea (props : JSX.IntrinsicElements['textarea']) {
  return <textarea {...props} class={" bg-white text-util border py-1 px-2 rounded-md border-gray-500 " + props.class} />;
}