import { Accessor, JSX, splitProps } from "solid-js";

export type ToggleableButtonProps ={
  inactiveClass?: string;
  activeClass?: string;
  isActive: boolean;
  onMouseOver?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onClick: (e: MouseEvent) => void;
  class?: string;
  children?: JSX.Element | ((isActive : boolean)=>JSX.Element);
}

export function ToggleableButton(props: ToggleableButtonProps) {
  return (
    <button
      class={
        "group rounded-md border p-1 " + (props.class || "") + " " +
        (props.isActive
          ? " border-blue-500 " + (props.activeClass || "")
          : " border-gray-500 hover:border-white-950 " + (props.inactiveClass || ""))
      }
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
      onMouseLeave={props.onMouseLeave}
    >
      {typeof props.children === 'function' ? props.children(props.isActive) : props.children}
    </button>
  );
}
