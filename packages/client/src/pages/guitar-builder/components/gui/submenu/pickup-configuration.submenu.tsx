import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { For } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { GuitarBuilder, Pickup } from "stranough-common";
import { ToggleableButton } from "~/commons/components/toggleable-button";

export function PickupConfigurationSubmenu() {
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <div class="grid gap-2">
          <For each={Pickup.pickupConfigurationLabels}>
            {(config) => (
              <ToggleableButton
                isActive={guitarBuilderCtx.pickupConfiguration.get() === config}
                onClick={() => {
                  guitarBuilderCtx.pickupConfiguration.set(config);
                }}
              >
                {config}
              </ToggleableButton>
            )}
          </For>
        </div>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
  );
}