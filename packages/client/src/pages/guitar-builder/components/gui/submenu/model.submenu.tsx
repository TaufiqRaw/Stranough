import { ToggleableButton } from "~/commons/components/toggleable-button";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { createQuery } from "@tanstack/solid-query";
import { For, Show, Suspense, getOwner } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { electricModelRepository } from "~/pages/admin/electric-model-editor/electric-model.repository";

export function ModelSubmenu(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const guitarModel = createQuery(()=>({
    queryKey : electricModelRepository.queryKey({
      // isElectric : guitarBuilderCtx?.isElectric.get(),
      page : 1,
      limit : 100,
    }),
    queryFn : async ()=>await electricModelRepository.index(1,{
      // isElectric : guitarBuilderCtx?.isElectric.get(),
      limit : 100,
    })
  }))
  return <GuitarBuilderSubmenu>
    {/* <GuitarBuilderSubmenuGroup>
      <span class="text-sm -mt-1">Jenis Gitar</span>
      <ToggleableButton
        isActive={typeof guitarBuilderCtx?.isElectric.get() ==='boolean' && !guitarBuilderCtx?.isElectric.get() }
        onClick={() => {
          guitarBuilderCtx.isElectric.set(false);
          guitarBuilderCtx.socket.selectComponent('isElectric', false);
        }}
      >
        Akustik
      </ToggleableButton>
      <ToggleableButton
        isActive={!!guitarBuilderCtx?.isElectric.get()}
        onClick={() => {
          guitarBuilderCtx.socket.selectComponent('isElectric', true);
          guitarBuilderCtx?.isElectric.set(true)
        }}
      >
        Elektrik
      </ToggleableButton>
    </GuitarBuilderSubmenuGroup> */}
    <GuitarBuilderSubmenuGroup>
      <span class="text-sm -mt-1">Bentuk Dasar Gitar</span>
      {/* <Show when={ guitarBuilderCtx?.isElectric.get() !== undefined }
        fallback={<div>
          <span class="text-gray-400">Pilih jenis gitar terlebih dahulu</span>
        </div>}
      > */}
        <Suspense >
          <div class="grid grid-cols-2 gap-2">
            <For each={guitarModel.data}>
              {(model)=>
                <GuitarBuilderImageButton
                  isActive={guitarBuilderCtx?.guitarModel.get()?.id.get() === model.id}
                  onClick={async () => {
                    const modelData = await electricModelRepository.get(model.id, {
                      owner : getOwner()!,
                    })
                    // guitarBuilderCtx.socket.selectComponent('guitarModel', modelData?.name.get());
                    guitarBuilderCtx?.constructionMethod.set(modelData?.selectedConstruction.get() ?? undefined);
                    guitarBuilderCtx?.topContour.set(modelData?.selectedTopContour.get() ?? undefined);
                    guitarBuilderCtx?.backContour.set(modelData?.selectedBackContour.get() ?? undefined);
                    guitarBuilderCtx?.guitarModel.set(modelData);
                  }}
                  //@ts-ignore
                  src={serverImgUrl(model.thumbnail?.filename, true)}
                  title={model.name}
                />
              }
            </For>
          </div>
        </Suspense>
      {/* </Show> */}
    </GuitarBuilderSubmenuGroup>
  </GuitarBuilderSubmenu>
}