import { createSignalObject } from "~/commons/functions/signal-object.util";
import { IGuitarBuilder } from "./types";
import { Constants } from "~/constants";
import { ServerEntities } from "stranough-server";
import { ElectricModel, Pickup as PickupConfig } from "stranough-common";

export function createGuitarComponent() : Omit<IGuitarBuilder, 'isBottomSideMenuSwiped' | 'socket'>{
  const constructionMethod = createSignalObject<typeof ElectricModel.constructionKeys[number] | undefined>();
  const contourTop = createSignalObject<Exclude<typeof ElectricModel.contourKeys[number], 'tummyContour'> | undefined | undefined>();
  const contourBack = createSignalObject<Exclude<typeof ElectricModel.contourKeys[number], 'forearmContour'> | undefined | undefined>();
  const pickupConfiguration = createSignalObject<typeof PickupConfig.pickupConfigurationLabels[number]>();

  const obj : Omit<IGuitarBuilder, 'isBottomSideMenuSwiped' | 'socket'> = {
    // isElectric : createSignalObject(),
    guitarModel : createSignalObject(),
    constructionMethod : {
      get : constructionMethod.get,
      set : (s : typeof ElectricModel.constructionKeys[number] | undefined)=>{
        obj.guitarModel.get()?.selectedConstruction.set(s);
        constructionMethod.set(s);
      }
    },
    stringCount : createSignalObject(),
    isLeftHanded : createSignalObject(),
    headstock : createSignalObject(),
    bodyCoreWood : createSignalObject('alder' as keyof typeof Constants.woodUrl),
    bodyTopWood : createSignalObject(),
    bodyColor : createSignalObject(),
    bodyColorType : createSignalObject(),
    neckWood : createSignalObject(),
    peg : createSignalObject(),
    bridge : createSignalObject(),
    jack : createSignalObject(),
    knob : createSignalObject(),
    bridgePickup : createSignalObject(),
    neckPickup : createSignalObject(),
    middlePickup : createSignalObject(),
    pickupConfiguration : {
      get : pickupConfiguration.get,
      set : (s ?: typeof PickupConfig.pickupConfigurationLabels[number])=>{
        if(pickupConfiguration.get() && (obj.middlePickup.get() || obj.neckPickup.get() || obj.bridgePickup.get())){
          const conf = window.confirm('Apakah anda yakin ingin mengganti pickup configuration?, pickup yang telah dipilih akan direset');
          if(conf){
            obj.middlePickup.set(undefined);
            obj.neckPickup.set(undefined);
            obj.bridgePickup.set(undefined);
            pickupConfiguration.set(s);
          }
        }else{
          pickupConfiguration.set(s);
        }
      }
    },
    backContour : {
      get : contourBack.get,
      set : (s)=>{
        obj.guitarModel.get()?.selectedBackContour.set(s);
        contourBack.set(s);
      }
    },
    topContour : {
      get : contourTop.get,
      set : (s)=>{
        obj.guitarModel.get()?.selectedTopContour.set(s);
        contourTop.set(s);
      }
    }
  };
  return obj;
}