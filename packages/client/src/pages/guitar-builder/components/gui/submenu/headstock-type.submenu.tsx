import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { For } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import { headstockRepository } from "~/pages/admin/headstock-editor/headstock.repository";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";

export function HeadstockTypeSubmenu(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const headstocks = createQuery(()=>({
    queryKey : headstockRepository.queryKey({
      page : 1,
      limit : 100,
    }),
    queryFn : async ()=>await headstockRepository.index(1,{
        limit : 100,
      }),
  }));

  return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-2 gap-2">
          <For each={headstocks.data}>
            {(headstock) => (
              <GuitarBuilderImageButton
                isActive={guitarBuilderCtx.headstock.get()?.id.get() === headstock.id}
                onClick={async () => {
                  if(!headstock.id) return;
                  const h = await headstockRepository.get(headstock.id);
                  if(!h) return;
                  guitarBuilderCtx.headstock.set(h);
                }}
                // @ts-ignore
                src={serverImgUrl(headstock.thumbnail?.filename)}
                title={headstock.name}
              />
            )}
          </For>
        </div>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
)}