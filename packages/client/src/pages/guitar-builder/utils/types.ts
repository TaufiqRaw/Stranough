import { Accessor, Component, JSX } from "solid-js";
import { ServerEntities } from "stranough-server";
import { orientationList } from "stranough-server/dist/chat-step";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { Constants } from "~/constants";
import { Headstock } from "~/pages/admin/headstock-editor/utils/types";
import { AvailableBackContour, AvailableTopContour, ElectricModel } from "~/pages/admin/electric-model-editor/utils/types";
import { guitarBuilderMenu } from "./constants";
import { Peg } from "~/pages/admin/peg-editor.ts/utils/types";
import { Bridge } from "~/pages/admin/bridge-editor/utils/types";
import { Knob } from "~/pages/admin/knob-editor/utils/types";
import { Jack } from "~/pages/admin/jack-editor/utils/types";
import { GuitarBuilder, GuitarModel, UtilTypes } from "stranough-common";

export type IGuitarBuilder = UtilTypes.Satisfies< Omit<GuitarBuilder.SelectedItem, 'isElectric'>,{
  isBottomSideMenuSwiped : {
    get : Accessor<boolean>,
    swiped : ()=>void,
  },
  // isElectric : SignalObject<boolean | undefined>,
  guitarModel : SignalObject<ElectricModel | undefined>,
  constructionMethod : {
    get : Accessor<typeof GuitarModel.bodyKeys[number] | undefined>,
    set : (s : typeof GuitarModel.bodyKeys[number] | undefined)=>void,
  },
  topContour : {
    get : Accessor<AvailableTopContour | undefined>,
    set : (s : AvailableTopContour | undefined)=>void,
  },
  backContour : {
    get : Accessor<AvailableBackContour | undefined>,
    set : (s : AvailableBackContour | undefined)=>void,
  },
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
}>;

export interface IGuitarBuilderMenuChildren {
  title : string,
  component ?: ()=>JSX.Element,
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