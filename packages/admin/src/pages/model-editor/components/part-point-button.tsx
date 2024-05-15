import { Show } from "solid-js";
import { Button } from "~/commons/components/button";
import { ToggleableButton } from "~/commons/components/toggleable-button";

export default function PartPointButton(props: {
  isActive: boolean;
  isFocus : boolean;
  onClick: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  onReset?: () => void;
  onView? : () => void;
  viewActive?: boolean;
  name: string;
}) {
  return (
    <div class="flex gap-1">
      <ToggleableButton
        onClick={props.onClick}
        onMouseOver={props.onHover}
        onMouseLeave={props.onLeave}
        isActive={props.isFocus}
        class="grow flex gap-2 items-center px-2 relative"
      >
        <div class="relative w-3">
          <div class={"w-3 h-3 rounded-full absolute top-1/2 transform -translate-y-1/2  " + (props.isActive ? 'bg-blue-500' : ' border border-gray-500')} />
        </div>
        <span class="pointer-events-none">{props.name}</span>
      </ToggleableButton>
      <Show when={props.isActive && !!props.onView}>
        <button
          class={"px-2 border rounded-md group " + (props.viewActive ? ' text-blue-500 border-blue-500' : ' border-gray-500 hover:border-white-950 text-gray-500 hover:text-white-950')}
          onClick={props.onView}
        >
          <i class="bi bi-eye"></i>
        </button>
      </Show>
      <Show when={props.isActive && !!props.onReset}>
        <button
          class="px-1 border border-gray-500 hover:border-red-500 rounded-md text-2xl text-gray-500 hover:text-red-500"
          onClick={props.onReset}
        >
          <i class="bi bi-x"></i>
        </button>
      </Show>
    </div>
  );
}
