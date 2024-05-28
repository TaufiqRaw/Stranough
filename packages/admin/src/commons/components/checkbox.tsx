import { Accessor, JSX, Show, createSignal } from "solid-js";

export function Checkbox(props: {
  onChange?: (checked: boolean) => void;
  checked?: Accessor<boolean>;
  label?: JSX.Element;
  containerClass?: string;
}) {
  return <button class={"flex gap-2 items-center group cursor-pointer" + props.containerClass} onClick={() =>{ props.onChange?.(!props.checked?.())}}>
    {props.label}
    <Show when={props.checked?.()}><i class="bi bi-check-square text-blue-500"></i></Show>
    <Show when={!props.checked?.()}><i class="bi bi-square"></i></Show>
  </button>
}