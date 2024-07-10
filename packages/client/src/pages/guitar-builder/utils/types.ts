import { Accessor, Component, JSX } from "solid-js";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { Constants } from "~/constants";
import { Headstock } from "~/pages/admin/headstock-editor/utils/types";
import { ElectricModel } from "~/pages/admin/electric-model-editor/utils/types";
import { guitarBuilderMenu } from "../constants";
import { Peg } from "~/pages/admin/peg-editor.ts/utils/types";
import { Bridge } from "~/pages/admin/bridge-editor/utils/types";
import { Knob } from "~/pages/admin/knob-editor/utils/types";
import { Jack } from "~/pages/admin/jack-editor/utils/types";
import { GuitarBuilder, ElectricModel as ElectricModelConfig, UtilTypes, Pickup as PickupConfig } from "stranough-common";
import { Pickup } from "~/pages/admin/pickup-editor/utils/types";

export type IGuitarBuilder = UtilTypes.Satisfies< Omit<GuitarBuilder.SelectedItem, 'isElectric'>,{
  isBottomSideMenuSwiped : {
    get : Accessor<boolean>,
    swiped : ()=>void,
  },
  // isElectric : SignalObject<boolean | undefined>,
  guitarModel : SignalObject<ElectricModel | undefined>,
  constructionMethod : {
    get : Accessor<typeof ElectricModelConfig.constructionKeys[number] | undefined>,
    set : (s : typeof ElectricModelConfig.constructionKeys[number] | undefined)=>void,
  },
  topContour : {
    get : Accessor<Exclude<typeof ElectricModelConfig.contourKeys[number], 'tummyContour'> | undefined>,
    set : (s : Exclude<typeof ElectricModelConfig.contourKeys[number], 'tummyContour'> | undefined)=>void,
  }
  backContour : {
    get : Accessor<Exclude<typeof ElectricModelConfig.contourKeys[number], "forearmContour"> | undefined>,
    set : (s : Exclude<typeof ElectricModelConfig.contourKeys[number], "forearmContour"> | undefined)=>void,
  }
  bodyCoreWood : SignalObject<keyof typeof Constants.woodUrl>,
  bodyTopWood : SignalObject<keyof typeof Constants.woodUrl | undefined>,
  neckWood : SignalObject<keyof typeof Constants.woodUrl | undefined>,
  headstock : SignalObject<Headstock | undefined>,
  isLeftHanded : SignalObject<boolean | undefined>,
  stringCount : SignalObject<number | undefined>,
  bodyColorType : SignalObject<typeof GuitarBuilder.bodyColorType[number]['key'] | undefined>,
  bodyColor : SignalObject<string | undefined>,
  peg : SignalObject<Peg | undefined>,
  bridge : SignalObject<Bridge | undefined>,
  knob : SignalObject<Knob | undefined>,
  jack : SignalObject<Jack | undefined>,
  pickupConfiguration : {
    get : Accessor<typeof PickupConfig.pickupConfigurationLabels[number] | undefined>,
    set : (s : typeof PickupConfig.pickupConfigurationLabels[number] | undefined)=>void,
  },
  neckPickup : SignalObject<Pickup | undefined>,
  bridgePickup : SignalObject<Pickup | undefined>,
  middlePickup : SignalObject<Pickup | undefined>,
}>;

export interface IGuitarBuilderMenuChildren {
  title : string,
  component ?: ()=>JSX.Element,
  checkAvailability ?: (ctx : IGuitarBuilder)=>boolean,
}

export interface IGuitarBuilderMenu {
  selectedChildren : SignalObject<number>,
  setSelectedChildren : (s : typeof guitarBuilderMenu[number]['children'][number]['title'])=>void,
  getSelectedChildrenObj : ()=>(IGuitarBuilderMenuChildren | undefined),
  caption: string;
  Icon: any;
  children : IGuitarBuilderMenuChildren[];
}

export interface IGuitarBuilderMenuContainer {
  selectedMenu : SignalObject<number | undefined>,
  setSelectedMenu : (s : typeof guitarBuilderMenu[number]['caption'])=>void,
  setSelectedSubmenu : (s : typeof guitarBuilderMenu[number]['children'][number]['title'])=>void,
  getSelectedMenuObj : ()=>(IGuitarBuilderMenu | undefined),
  menus: IGuitarBuilderMenu[];
}