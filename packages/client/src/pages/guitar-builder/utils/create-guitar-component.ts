import { createSignalObject } from "~/commons/functions/signal-object.util";
import { IGuitarBuilder } from "./types";
import { Constants } from "~/constants";
import { ServerEntities } from "stranough-server";
import { ElectricModel } from "stranough-common";

export function createGuitarComponent() : Omit<IGuitarBuilder, 'isBottomSideMenuSwiped' | 'socket'>{
  const constructionMethod = createSignalObject<typeof ElectricModel.constructionKeys[number] | undefined>();
  const contourTop = createSignalObject<Exclude<typeof ElectricModel.contourKeys[number], 'tummyContour'> | undefined | undefined>();
  const contourBack = createSignalObject<Exclude<typeof ElectricModel.contourKeys[number], 'forearmContour'> | undefined | undefined>();
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