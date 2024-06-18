import { createQuery } from "@tanstack/solid-query";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { For } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { bridgeRepository } from "~/pages/admin/bridge-editor/bridge.repository";

export function BridgeSubmenu() {
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const bridge = createQuery(()=>({
    queryKey : bridgeRepository.queryKey({
      page : 1,
      limit : 100,
    }),
    queryFn : async ()=>await bridgeRepository.index(1,{
      limit : 100,
    }),
  }));

  return (
    <GuitarBuilderSubmenu mustHaveModel>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-2 gap-2">
          <For each={bridge.data}>
            {(bridge) => (
              <GuitarBuilderImageButton
                isActive={guitarBuilderCtx.bridge.get()?.id.get() === bridge.id}
                onClick={async () => {
                  if(!bridge.id) return;
                  const item = await bridgeRepository.get(bridge.id);
                  if(!item) return;
                  guitarBuilderCtx.bridge.set(item);
                  guitarBuilderCtx.socket.selectComponent('bridge', item.name.get());
                }}
                // @ts-ignore
                src={serverImgUrl(bridge.thumbnail?.filename)}
                title={bridge.name}
              />
            )}
          </For>
        </div>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
)}