import BodyIcon from "~/commons/icons/BodyIcon";
import ComponentIcon from "~/commons/icons/ComponentIcon";
import FingerboardIcon from "~/commons/icons/FingerboardIcon";
import GeneralIcon from "~/commons/icons/GeneralIcon";
import { ModelSubmenu } from "./components/gui/submenu/model.submenu";
import { ConstructionAndContourSubmenu } from "./components/gui/submenu/construction-and-contour.submenu";
import { BodyCoreWoodSubmenu } from "./components/gui/submenu/body-core-wood.submenu";
import { BodyTopWoodSubmenu } from "./components/gui/submenu/body-top-wood.submenu";
import { BodyColorSubmenu } from "./components/gui/submenu/body-color.submenu";
import { NeckWoodSubmenu } from "./components/gui/submenu/neck-wood.submenu";
import { HeadstockTypeSubmenu } from "./components/gui/submenu/headstock-type.submenu";
import { GuitarModelSolidColorPresenter } from "~/commons/presenter/guitar-model/guitar-model-solid-color.presenter";
import { TunerSubmenu } from "./components/gui/submenu/tuner.submenu";
import { BridgeSubmenu } from "./components/gui/submenu/bridge.submenu";
import { JackSubmenu } from "./components/gui/submenu/jack.submenu";
import { KnobSubmenu } from "./components/gui/submenu/knob.submenu";
import { IGuitarBuilder } from "./utils/types";
import { PickupConfigurationSubmenu } from "./components/gui/submenu/pickup-configuration.submenu";
import { Pickup } from "stranough-common";
import { BridgePickupSubmenu, MiddlePickupSubmenu, NeckPickupSubmenu } from "./components/gui/submenu/pickup-submenu";

export const bodyColorToComponent = {
  'solid' : GuitarModelSolidColorPresenter 
} as const

export const guitarBuilderMenu = [
  {
    caption: "General",
    Icon: GeneralIcon,
    children: [
      { title: "Model",
        component: () => <ModelSubmenu /> 
      },
      {
        title: "Construction & Contour",
        component: () => <ConstructionAndContourSubmenu />,
      },
      {
        title : "Pickup Configuration",
        component : () => <PickupConfigurationSubmenu />
      }
    ],
  },
  {
    caption: "Body",
    Icon: BodyIcon,
    children: [
      { title: "Core Wood", component: () => <BodyCoreWoodSubmenu /> },
      { title: "Top Wood", component: () => <BodyTopWoodSubmenu /> },
      // { title: "Binding", component: () => <BodyBindingSubmenu /> },
      { title: "Warna", component: () => <BodyColorSubmenu /> },
    ],
  },
  {
    caption: "Neck",
    Icon: FingerboardIcon,
    children: [
      { title: "Kayu Neck", component: () => <NeckWoodSubmenu /> },
      // { title: "Warna" },
      { title: "Jenis Headstock", component: () => <HeadstockTypeSubmenu /> },
    ],
  },
  // {
  //   caption: "Electronics",
  //   Icon: ElectronicIcon,
  //   children: [{ title: "Pickups" }, { title: "Controls" }],
  // },
  {
    caption: "Components",
    Icon: ComponentIcon,
    children: [
      { title: "Tuners", component: () => <TunerSubmenu /> },
      { title: "Bridge", component: () => <BridgeSubmenu /> },
      { title: "Jack" , component: () => <JackSubmenu/>},
      { title: "Knob", component: () => <KnobSubmenu/>},
      { title : "Neck Pickup",
        checkAvailability : (ctx : IGuitarBuilder)=>(ctx.pickupConfiguration.get() && Pickup.labelToPickupConfiguration[ctx.pickupConfiguration.get()!].length > 1) ? true : false,
        component : () => <NeckPickupSubmenu />
      },
      { title : "Middle Pickup",
        checkAvailability : (ctx : IGuitarBuilder)=>(ctx.pickupConfiguration.get() && Pickup.labelToPickupConfiguration[ctx.pickupConfiguration.get()!].length == 3) ? true : false,
        component : () => <MiddlePickupSubmenu />
      },
      { title : "Bridge Pickup",
        checkAvailability : (ctx : IGuitarBuilder)=>(ctx.pickupConfiguration.get()) ? true : false,
        component : () => <BridgePickupSubmenu />
      },
      // { title: "Nut" },
      // { title: "Strings" },
    ],
  },
] as const;
