import { For, Show } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import {
  GuitarBuilderSubmenu,
  GuitarBuilderSubmenuGroup,
} from "../guitar-builder.submenu";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilder } from "stranough-common";

export function BodyColorSubmenu() {
  const builderCtx = useGuitarBuilderContext()!;
  return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <span class="text-sm -mt-1">Tipe Warna</span>
        <ToggleableButton
          isActive={!builderCtx.bodyColorType.get()}
          onClick={() => builderCtx.bodyColorType.set(undefined)}
        >
          Natural / Transparent
        </ToggleableButton>
        <For each={GuitarBuilder.bodyColorType}>
          {(color) => (
            <ToggleableButton
              isActive={builderCtx.bodyColorType.get() === color.key}
              onClick={() => {
                builderCtx.bodyColorType.set(color.key);
              }}
            >
              {color.name}
            </ToggleableButton>
          )}
        </For>
      </GuitarBuilderSubmenuGroup>
      <span class="text-sm -mt-1">Warna</span>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-3 gap-2">
          <Show when={builderCtx.bodyColorType.get() === 'solid'}>
            {Object.entries(GuitarBuilder.solidColors).map(([key, color]) => (
              <GuitarBuilderImageButton
                onClick={() => {
                  builderCtx.bodyColor.set(key);
                }}
                isActive={builderCtx.bodyColor.get() === key}
                title={key}
              >
                {()=><div class="w-full h-full" style={{"background-color":`#${color.toString(16)}`}}/>}
              </GuitarBuilderImageButton>
            ))}
          </Show>
        </div>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
  );
}
