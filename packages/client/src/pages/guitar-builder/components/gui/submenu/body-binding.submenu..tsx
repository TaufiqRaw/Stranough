import { For } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import {
  GuitarBuilderSubmenu,
  GuitarBuilderSubmenuGroup,
} from "../guitar-builder.submenu";
import { Constants } from "~/constants";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { GuitarBuilder } from "stranough-common";

export function BodyBindingSubmenu() {
  return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <span class="text-sm -mt-1">Body Binding</span>
        <For each={GuitarBuilder.bindings}>
          {(item)=><ToggleableButton
            isActive={true}
            onClick={() => {}}
          >
            {item.name}
          </ToggleableButton>}
        </For>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
  );
}
