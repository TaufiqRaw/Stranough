import { For } from "solid-js";
import {
  GuitarBuilderSubmenu,
  GuitarBuilderSubmenuGroup,
} from "../guitar-builder.submenu";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { Constants } from "~/constants";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import {GuitarBuilder} from "stranough-common";

export function NeckWoodSubmenu() {
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-2 gap-2">
          <For each={GuitarBuilder.neckWoods}>
            {(wood) => (
              <GuitarBuilderImageButton
                isActive={guitarBuilderCtx.neckWood.get() === wood.key}
                onClick={() =>{
                  guitarBuilderCtx.neckWood.set(wood.key);
                  guitarBuilderCtx.socket.selectComponent('neckWood', wood.name);
                }}
                src={Constants.woodUrl[wood.key]}
                title={wood.name}
              />
            )}
          </For>
        </div>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
  );
}
