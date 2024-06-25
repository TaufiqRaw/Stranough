import { createQuery } from "@tanstack/solid-query";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { For } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { knobRepository } from "~/pages/admin/knob-editor/knob.repository";
import { jackRepository } from "~/pages/admin/jack-editor/jack.repository";

export function JackSubmenu() {
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const jacks = createQuery(()=>({
    queryKey : jackRepository.queryKey({
      page : 1,
      limit : 100,
    }),
    queryFn : async ()=>await jackRepository.index(1,{
      limit : 100,
    }),
  }));

  return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-2 gap-2">
          <For each={jacks.data}>
            {(jack) => (
              <GuitarBuilderImageButton
                isActive={guitarBuilderCtx.jack.get()?.id.get() === jack.id}
                onClick={async () => {
                  if(!jack.id) return;
                  const item = await jackRepository.get(jack.id);
                  if(!item) return;
                  guitarBuilderCtx.jack.set(item);
                }}
                // @ts-ignore
                src={serverImgUrl(jack.thumbnail?.filename)}
                title={jack.name}
              />
            )}
          </For>
        </div>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
)}