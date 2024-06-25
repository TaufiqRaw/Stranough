import { createQuery } from "@tanstack/solid-query";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { For } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { knobRepository } from "~/pages/admin/knob-editor/knob.repository";

export function KnobSubmenu() {
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const knobs = createQuery(()=>({
    queryKey : knobRepository.queryKey({
      page : 1,
      limit : 100,
    }),
    queryFn : async ()=>await knobRepository.index(1,{
      limit : 100,
    }),
  }));

  return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-2 gap-2">
          <For each={knobs.data}>
            {(knob) => (
              <GuitarBuilderImageButton
                isActive={guitarBuilderCtx.knob.get()?.id.get() === knob.id}
                onClick={async () => {
                  if(!knob.id) return;
                  const item = await knobRepository.get(knob.id);
                  if(!item) return;
                  guitarBuilderCtx.knob.set(item);
                }}
                // @ts-ignore
                src={serverImgUrl(knob.thumbnail?.filename)}
                title={knob.name}
              />
            )}
          </For>
        </div>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
)}