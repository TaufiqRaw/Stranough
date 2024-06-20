import { createSignalObject } from "~/commons/functions/signal-object.util";
import { IGuitarBuilder } from "./types";
import { Constants } from "~/constants";
import { ServerEntities } from "stranough-server";
import { AvailableBackContour, AvailableTopContour } from "~/pages/admin/electric-model-editor/utils/types";
import { GuitarModel } from "stranough-common";

export function createGuitarComponent() : Omit<IGuitarBuilder, 'isBottomSideMenuSwiped' | 'socket'>{
  const constructionMethod = createSignalObject<typeof GuitarModel.bodyKeys[number] | undefined>();
  const contourTop = createSignalObject<AvailableTopContour | undefined>();
  const contourBack = createSignalObject<AvailableBackContour | undefined>();
  const obj : Omit<IGuitarBuilder, 'isBottomSideMenuSwiped' | 'socket'> = {
    // isElectric : createSignalObject(),
    guitarModel : createSignalObject(),
    constructionMethod : {
      get : constructionMethod.get,
      set : (s : typeof GuitarModel.bodyKeys[number] | undefined)=>{
        obj.guitarModel.get()?.selectedBody.set(s);
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
      set : (s : AvailableBackContour | undefined)=>{
        obj.guitarModel.get()?.getSelectedBodySignal()?.selectedBackContour.set(s);
        contourBack.set(s);
      }
    },
    topContour : {
      get : contourTop.get,
      set : (s : AvailableTopContour | undefined)=>{
        obj.guitarModel.get()?.getSelectedBodySignal()?.selectedTopContour.set(s);
        contourTop.set(s);
      }
    }
  };
  return obj;
}