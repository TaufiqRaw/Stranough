import { JSX, splitProps } from "solid-js";

export function Input (props : JSX.IntrinsicElements['input']) {
  const [local, others] = splitProps(props, ['class']);

  return <input {...props} class={" bg-white text-black border py-1 px-2 rounded-md border-gray-500 " + local.class} />;
}