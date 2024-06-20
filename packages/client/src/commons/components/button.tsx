import { A } from "@solidjs/router";
import { JSX, splitProps } from "solid-js";

interface ourProps {href ?: string}

type propType = JSX.IntrinsicElements['button'] & ourProps;

export function Button(props : propType){
  const [local, others] = splitProps(props, ['class', 'children', 'href']);

  const _Button = <button class={"bg-blue-500 text-white-950 p-2 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed " + local.class} {...others} >
    {local.children}
  </button>;

  if(local.href)
    return <A class="block cursor-pointer" href={local.href}>
      {_Button}
    </A>

  return _Button;
}