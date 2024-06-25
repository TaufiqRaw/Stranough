import { For } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { Constants } from "~/constants";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import {GuitarBuilder} from 'stranough-common';

export function BodyTopWoodSubmenu() {
    const guitarBuilderCtx = useGuitarBuilderContext()!;
    return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-2 gap-2">
          <GuitarBuilderImageButton
            isActive={!guitarBuilderCtx.bodyTopWood.get()}
            onClick={() => {
              guitarBuilderCtx.bodyTopWood.set(undefined);
            }}
            icon={() => <i class="bi bi-ban text-5xl" />}
            title="None"
          />
          <For each={GuitarBuilder.bodyTopWoods}>
            {(wood) => (
              <GuitarBuilderImageButton
                isActive={guitarBuilderCtx.bodyTopWood.get() === wood.key}
                onClick={() => {
                  guitarBuilderCtx.bodyTopWood.set(wood.key)
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