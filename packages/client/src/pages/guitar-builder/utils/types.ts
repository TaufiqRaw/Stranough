import { Accessor, Component, JSX } from "solid-js";
import { CustomSetterSignalObject as SignalObject } from "~/commons/interfaces/signal-object";
import { Constants } from "~/constants";
import { Headstock } from "~/pages/admin/headstock-editor/utils/types";
import { ElectricModel } from "~/pages/admin/electric-model-editor/utils/types";
import { Peg } from "~/pages/admin/peg-editor.ts/utils/types";
import { Bridge } from "~/pages/admin/bridge-editor/utils/types";
import { Knob } from "~/pages/admin/knob-editor/utils/types";
import { Jack } from "~/pages/admin/jack-editor/utils/types";
import { GuitarBuilder, ElectricModel as ElectricModelConfig, UtilTypes, Pickup as PickupConfig } from "stranough-common";
import { Pickup } from "~/pages/admin/pickup-editor/utils/types";
import {OmitProperties, PickProperties} from 'ts-essentials';
import { Nut } from "~/pages/admin/nut-editor/utils/types";
import { Position } from "~/commons/interfaces/position";


type electricOmitNumber = OmitProperties<GuitarBuilder.SelectedItem['electric'],number | undefined>
type electricPickNumber = {
  [k in keyof PickProperties<GuitarBuilder.SelectedItem['electric'],number | undefined>]: any
}

type acousticOmitNumber = OmitProperties<GuitarBuilder.SelectedItem['acoustic'],number>
type acousticPickNumber = {
  [k in keyof PickProperties<GuitarBuilder.SelectedItem['acoustic'],number>]: any
}

type SelectedItemAsSignalObject = {
  guitarType : SignalObject<GuitarBuilder.SelectedItem['guitarType'] | undefined>,
  orientation : SignalObject<GuitarBuilder.SelectedItem['orientation'] | undefined>,
  assembleGuitar : SignalObject<boolean | undefined>,
  electric : {
    [k in keyof electricOmitNumber]: SignalObject<(GuitarBuilder.SelectedItem['electric'][k] | undefined)>
  } & UtilTypes.Satisfies<electricPickNumber, {
    nut : SignalObject<Nut | undefined>,
    guitarModel : SignalObject<ElectricModel | undefined>,
    bridge : SignalObject<Bridge | undefined>,
    // jack : SignalObject<Jack | undefined>,
    bridgePickup : SignalObject<Pickup | undefined>,
    neckPickup : SignalObject<Pickup | undefined>,
    middlePickup : SignalObject<Pickup | undefined>,
    knob : SignalObject<Knob | undefined>,
    headstock : SignalObject<Headstock | undefined>,
    peg : SignalObject<Peg | undefined>,
    bridge2 : SignalObject<Bridge | undefined>,
  }> & {
    stringCountValue : Accessor<number | undefined>,
    fretCountValue : Accessor<number | undefined>,
    scaleLengthValue : Accessor<number | 'multi-scale' | undefined>,
  },
  acoustic : {
    [k in keyof acousticOmitNumber]: SignalObject<(GuitarBuilder.SelectedItem['acoustic'][k] | undefined)>
  } & UtilTypes.Satisfies<acousticPickNumber, {
    guitarModel : SignalObject<ElectricModel | undefined>,
    headstock : SignalObject<Headstock | undefined>,
    peg : SignalObject<Peg | undefined>,
    nut : SignalObject<Nut | undefined>,
  }> & {
    stringCountValue : Accessor<number | undefined>,
    fretCountValue : Accessor<number | undefined>,
    scaleLengthValue : Accessor<number | 'multi-scale' | undefined>,
  },
  getSelectedCategory : ()=>'electric' | 'acoustic' | undefined,
  getSelectedCategoryObj : ()=>SelectedItemAsSignalObject['electric'] | SelectedItemAsSignalObject['acoustic'] | undefined,
}

export type IGuitarBuilder = SelectedItemAsSignalObject & {
  totalPrice : Accessor<number>,
  electricPrices : Accessor<{[k in keyof GuitarBuilder.SelectedItem['electric']] : number}>,
  stringSpawnpoints : {
    headstock : SignalObject<Position|undefined>[]
    nut : SignalObject<Position|undefined>[]
    bridge : SignalObject<Position|undefined>[]
    tailpiece : SignalObject<Position|undefined>[]
    fromTop : Accessor<Position[][]>
  }
};

export interface IGuitarBuilderMenuChildren {
  title : string,
  component ?: ()=>JSX.Element,
  checkAvailability ?: (ctx : IGuitarBuilder)=>boolean,
}