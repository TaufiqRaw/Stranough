import { For } from "solid-js";
import {
  GuitarBuilderSubmenu,
  GuitarBuilderSubmenuGroup,
} from "../guitar-builder.submenu";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { Constants } from "~/constants";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilder } from "stranough-common";

export function BodyCoreWoodSubmenu() {
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-2 gap-2">
          <For each={GuitarBuilder.bodyCoreWoods}>
            {(wood) => (
              <GuitarBuilderImageButton
                isActive={guitarBuilderCtx.bodyCoreWood.get() === wood.key}
                onClick={() => {
                  guitarBuilderCtx.bodyCoreWood.set(wood.key);
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
