import { createQuery } from "@tanstack/solid-query";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { Accessor, For, createMemo } from "solid-js";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { knobRepository } from "~/pages/admin/knob-editor/knob.repository";
import { jackRepository } from "~/pages/admin/jack-editor/jack.repository";
import { Pickup as PickupConfig } from "stranough-common";
import { pickupRepository } from "~/pages/admin/pickup-editor/pickup.repository";
import { Pickup } from "~/pages/admin/pickup-editor/utils/types";

function PickupSubmenu(
  props : {
    selectedPickupId : Accessor<number | undefined>,
    onSelectPickup : (pickup : Pickup) => void,
    type : 'neck' | 'middle' | 'bridge',
  }
) {
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const selectedPickupConfigLabel = guitarBuilderCtx.pickupConfiguration.get();
  const selectedPickupConfigValue = createMemo(()=>selectedPickupConfigLabel && PickupConfig.labelToPickupConfiguration[selectedPickupConfigLabel]);

  const pickupTypeToIndex = createMemo(()=>{
    const pickupConfig = selectedPickupConfigValue();
    if(pickupConfig?.length === 1){
      return 0;
    }else if(pickupConfig?.length === 2){
      return props.type === 'neck' ? 0 : 1;
    }else {
      return props.type === 'neck' ? 0 : props.type === 'middle' ? 1 : 2;
    }
  });

  const pickups = createQuery(()=>({
    queryKey : pickupRepository.queryKey({
      page : 1,
      limit : 100,
      type : selectedPickupConfigValue()?.[pickupTypeToIndex()],
    }),
    queryFn : async ()=>await pickupRepository.index(1,{
      limit : 100,
      type : selectedPickupConfigValue()?.[pickupTypeToIndex()],
    }),
  }));

  return (
    <GuitarBuilderSubmenu mustHaveModel mustHavePickupConfiguration>
      <GuitarBuilderSubmenuGroup>
        <div class="grid grid-cols-2 gap-2">
          <For each={pickups.data}>
            {(pickup) => (
              <GuitarBuilderImageButton
                isActive={props.selectedPickupId() === pickup.id}
                onClick={async () => {
                  if(!pickup.id) return;
                  const item = await pickupRepository.get(pickup.id);
                  if(!item) return;
                  props.onSelectPickup(item);
                }}
                // @ts-ignore
                src={serverImgUrl(pickup.thumbnail?.filename)}
                title={pickup.name}
              />
            )}
          </For>
        </div>
      </GuitarBuilderSubmenuGroup>
    </GuitarBuilderSubmenu>
)}

export function NeckPickupSubmenu(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const selectedPickupId = createMemo(()=>guitarBuilderCtx.neckPickup.get()?.id.get());
  const onSelectPickup = (pickup : Pickup) => {
    guitarBuilderCtx.neckPickup.set(pickup);
  };

  return (
    <PickupSubmenu
      selectedPickupId={selectedPickupId}
      onSelectPickup={onSelectPickup}
      type="neck"
    />
  );
}

export function MiddlePickupSubmenu(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const selectedPickupId = createMemo(()=>guitarBuilderCtx.middlePickup.get()?.id.get());
  const onSelectPickup = (pickup : Pickup) => {
    guitarBuilderCtx.middlePickup.set(pickup);
  };

  return (
    <PickupSubmenu
      selectedPickupId={selectedPickupId}
      onSelectPickup={onSelectPickup}
      type="middle"
    />
  );
}

export function BridgePickupSubmenu(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const selectedPickupId = createMemo(()=>guitarBuilderCtx.bridgePickup.get()?.id.get());
  const onSelectPickup = (pickup : Pickup) => {
    guitarBuilderCtx.bridgePickup.set(pickup);
  };

  return (
    <PickupSubmenu
      selectedPickupId={selectedPickupId}
      onSelectPickup={onSelectPickup}
      type="bridge"
    />
  );
}