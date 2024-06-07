import { createSignalObject } from "~/commons/functions/signal-object.util";
import { IGuitarComponent } from "./types";
import { chatbotStep } from "./constants";

export function createGuitarComponent() : IGuitarComponent{
  return {
    context : createSignalObject(chatbotStep[0]),
    isElectric : createSignalObject(),
    guitarModel : createSignalObject(),
    constructionMethod : createSignalObject(),
    stringCount : createSignalObject(),
    isLeftHanded : createSignalObject(),
    headstock : createSignalObject(),
  }
}