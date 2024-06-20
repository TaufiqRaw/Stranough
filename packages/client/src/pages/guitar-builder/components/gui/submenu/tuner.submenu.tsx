import { createQuery } from "@tanstack/solid-query";
import { pegRepository } from "~/pages/admin/peg-editor.ts/peg.repository";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { For } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";

export function TunerSubmenu() {
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const tuners = createQuery(()=>({
    queryKey : pegRepository.queryKey({
      page : 1,
      limit : 100,
    }),
    queryFn : async ()=>await pegRepository.index(1,{
        limit : 100,
      }),
  }));

  return (
    <GuitarBuilderSubmenu mustHaveModel mustHaveHeadstock>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-2 gap-2">
          <For each={tuners.data}>
            {(tuner) => (
              <GuitarBuilderImageButton
                isActive={guitarBuilderCtx.peg.get()?.id.get() === tuner.id}
                onClick={async () => {
                  if(!tuner.id) return;
                  const item = await pegRepository.get(tuner.id);
                  if(!item) return;
                  guitarBuilderCtx.peg.set(item);
                  guitarBuilderCtx.socket.selectComponent('peg', item.name.get());
                }}
                // @ts-ignore
                src={serverImgUrl(tuner.thumbnail?.filename)}
                title={tuner.name}
              />
            )}
          </For>
        </div>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
)}