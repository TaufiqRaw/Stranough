import { ElectricModel, Pickup } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { createMemo } from "solid-js";

const pickupConfigurationThumbnails : {[k in keyof typeof Pickup.pickupConfigurations['electric-guitar']] : string} & {
  [k in keyof typeof Pickup.pickupConfigurations['electric-bass']] : string
} = {
  S : "/assets/gui/pickup/s.png",
  "S-S" : "/assets/gui/pickup/ss.png",
  "S-S-S" : "/assets/gui/pickup/sss.png",
  H : "/assets/gui/pickup/h.png",
  "H-H" : "/assets/gui/pickup/hh.png",
  "H-S" : "/assets/gui/pickup/hs.png",
  "H-S-S" : "/assets/gui/pickup/hss.png",
  "H-H-H" : "/assets/gui/pickup/hhh.png",
  "H-S-H" : "/assets/gui/pickup/hsh.png",
  P90 : "/assets/gui/pickup/p90.png",
  "P90-P90" : "/assets/gui/pickup/p90p90.png",
  J : "/assets/gui/pickup/j.png",
  P : "/assets/gui/pickup/p.png",
  "J-J" : "/assets/gui/pickup/jj.png",
  "P-P" : "/assets/gui/pickup/pp.png",
  "P-J" : "/assets/gui/pickup/pj.png",
  "1 Soap Bar" : "/assets/gui/pickup/1soapbar.png",
  "2 Soap Bar" : "/assets/gui/pickup/2soapbar.png",
  "1 MM" : "/assets/gui/pickup/1mm.png",
  "2 MM" : "/assets/gui/pickup/2mm.png",
}

export const PickupConfigurationSelector = () => {
  const selected = useGuitarBuilderContext()!;
  return <ItemSelector
    items={()=>createMemo(()=>Object.keys(Pickup.pickupConfigurations[selected.guitarType.get()! as 'electric-guitar' | 'electric-bass']).map(k=>({
      key : k as keyof typeof Pickup.pickupConfigurations['electric-guitar' | 'electric-bass'],
      name : k,
      // thumbnailSrc : pickupConfigurationThumbnails[k as keyof typeof Pickup.pickupConfigurations['electric-guitar' | 'electric-bass']],
    })))}
    onClick={async(i, o, ctx)=>{
      ctx?.electric.pickupConfiguration.set(i.key);
    }}
    selected={(i, ctx)=>{
      return i.key === ctx?.electric.pickupConfiguration.get()
    }}
    type="text"
  />
}