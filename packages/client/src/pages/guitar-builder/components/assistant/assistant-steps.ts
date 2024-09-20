import { JSX } from "solid-js";
import { AssistMode } from "./steps/assist-mode";
import { electricAssistant } from "./steps/electric/electric-assistant";
import { NeckProfileSelector } from "../selectors/neck-profile-selector";
import { commonAssistant } from "./steps/common-assistant";
import { fingerboardEdge, fingerboardRadius, fingerboardWoods, sideInlay} from "stranough-common/dist/guitar-builder";
import { IGuitarBuilder } from "../../utils/types";
import { Bridge, Pickup } from "stranough-common";
import { ElectricModelAssistant } from "./steps/electric/electric-model-assistant";

export type assistantStepKeysType = typeof assistantStepKeys[keyof typeof assistantStepKeys]; 

export const assistantStepKeys = Object.freeze({
  guitarType : 'guitar-type',
  assistMode : 'assist-mode',
  uploadImage : 'upload-image',
  describeGuitar : 'describe-guitar',
  
  electricModelType : 'electric-model-type',
  electricBodyType : 'electric-body-type',
  stringCount : 'string-count',
  constructionMethod : 'construction-method',
  topContour : 'top-contour',
  backContour : 'back-contour',
  bodyCoreWood : 'body-core-wood',
  bodyTopWood : 'body-top-wood',
  topBinding : 'top-binding',
  backBinding : 'back-binding',
  topBodyColor : 'top-body-color',
  topBodyColorType : 'top-body-color-type',
  backBodyColor : 'back-body-color',
  backBodyColorType : 'back-body-color-type',
  burstType : 'burst-type',
  burstColor : 'burst-color',
  neckWood : 'neck-wood',
  neckBinding : 'neck-binding',
  neckColor : 'neck-color',
  neckColorType : 'neck-color-type',
  neckProfile : 'neck-profile',
  trussRodPosition : 'truss-rod-position',
  trussRodType : 'truss-rod-type',
  carbonFiberRod : 'carbon-fiber-rod',

  fingerboardWoods : 'fingerboard-woods',
  inlay : 'inlay',
  sideInlay : 'side-inlay',
  fingerboardRadius : 'fingerboard-radius',
  useFret : 'use-fret',
  fretCount : 'fret-count',
  fingerboardEdge : 'fingerboard-edge',

  headstock : 'headstock',
  headstockOverlay : 'headstock-overlay',
  peg : 'peg',
  nut : 'nut',
  bridge : 'bridge',
  bridge2 : 'bridge2',
  pickguardMaterial : 'pickguard-material',
  knob : 'knob',
  jack : 'jack',
  pickupConfiguration : 'pickup-configuration',
  bridgePickup : 'bridge-pickup',
  neckPickup : 'neck-pickup',
  middlePickup : 'middle-pickup',

  next : 'next', // This will not be used in assistantSteps
})

export const assistantSteps : {
  key : string,
  component : ()=>JSX.Element,
  skip ?: (ctx : IGuitarBuilder)=>boolean
}[] = [
  // {
  //   key : assistantStepKeys.guitarType,
  //   component : SelectType
  // },
  {
    key : assistantStepKeys.assistMode,
    component : AssistMode
  }
  ,{
    key : assistantStepKeys.electricModelType,
    component : ElectricModelAssistant
  },{
    key : assistantStepKeys.electricBodyType,
    component : electricAssistant.bodyType
  },
  {
    key : assistantStepKeys.stringCount,
    component : commonAssistant.stringCount
  },
  {
    key : assistantStepKeys.constructionMethod,
    component : electricAssistant.constructionMethod
  },{
    key : assistantStepKeys.topContour,
    component : electricAssistant.topContour,
  },{
    key : assistantStepKeys.backContour,
    component : electricAssistant.backContour,
  },{
    key : assistantStepKeys.bodyCoreWood,
    component : electricAssistant.bodyCoreWood,
  },{
    key : assistantStepKeys.bodyTopWood,
    component : electricAssistant.bodyTopWood,
  },{
    key : assistantStepKeys.topBinding,
    component : commonAssistant.topBinding,
  },{
    key : assistantStepKeys.backBinding,
    component : commonAssistant.backBinding,
  },{
    key : assistantStepKeys.topBodyColorType,
    component : commonAssistant.topBodyColorType,
  },{
    key : assistantStepKeys.topBodyColor,
    component : commonAssistant.topBodyColor,
    skip : (ctx)=>ctx.getSelectedCategoryObj()?.topBodyColorType.get() === undefined || ctx.getSelectedCategoryObj()?.topBodyColorType.get() === 'natural'
  },{
    key : assistantStepKeys.backBodyColorType,
    component : commonAssistant.backBodyColorType,
  },{
    key : assistantStepKeys.backBodyColor,
    component : commonAssistant.backBodyColor,
    skip : (ctx)=>ctx.getSelectedCategoryObj()?.backBodyColorType.get() === undefined || ctx.getSelectedCategoryObj()?.backBodyColorType.get() === 'natural'
  },{
    key : assistantStepKeys.burstType,
    component : commonAssistant.burstType,
  },{
    key : assistantStepKeys.burstColor,
    component : commonAssistant.burstColor,
    skip : (ctx)=>ctx.getSelectedCategoryObj()?.burstType.get() === undefined
  },{
    key : assistantStepKeys.neckWood,
    component : commonAssistant.neckWood,
  },{
    key : assistantStepKeys.neckProfile,
    component : commonAssistant.neckProfile,
  },{
    key : assistantStepKeys.trussRodType,
    component : commonAssistant.trussRodType,
  }
  ,{
    key : assistantStepKeys.trussRodPosition,
    component : commonAssistant.trussRodPosition,
  },{
    key : assistantStepKeys.neckColorType,
    component : commonAssistant.neckColorType,
  },{
    key : assistantStepKeys.neckColor,
    component : commonAssistant.neckColor,
    skip : (ctx)=>ctx.getSelectedCategoryObj()?.neckColorType.get() === undefined || ctx.getSelectedCategoryObj()?.neckColorType.get() === 'natural'
  }
  // ,{
  //   key : assistantStepKeys.neckBinding,
  //   component : commonAssistant.neckBinding,
  // }
  ,{
    key : assistantStepKeys.carbonFiberRod,
    component : commonAssistant.carbonFiberRod,
  },{
    key : assistantStepKeys.fingerboardWoods,
    component : commonAssistant.fingerboardWood,
  },{
    key : assistantStepKeys.sideInlay,
    component : commonAssistant.sideInlay,
  },{
    key : assistantStepKeys.fingerboardRadius,
    component : commonAssistant.fingerboardRadius,
  },{
    key : assistantStepKeys.useFret,
    component : commonAssistant.useFret,
  },{
    key : assistantStepKeys.inlay,
    component : electricAssistant.inlay,
  },{
    key : assistantStepKeys.fretCount,
    component : commonAssistant.fretCount,
  },{
    key : assistantStepKeys.fingerboardEdge,
    component : commonAssistant.fingerboardEdge,
  },{
    key : assistantStepKeys.headstock,
    component : commonAssistant.headstock,
  },{
    key : assistantStepKeys.headstockOverlay,
    component : commonAssistant.headstockOverlay
  },{
    key : assistantStepKeys.peg,
    component : commonAssistant.peg,
  },{
    key : assistantStepKeys.nut,
    component : commonAssistant.nut,
  },
  {
    key : assistantStepKeys.bridge,
    component : electricAssistant.bridge,
  },{
    key : assistantStepKeys.bridge2,
    component : electricAssistant.bridge2!,
    // skip when first bridge is not selected or first bridge type is not in the list
    skip : (ctx)=>!ctx.electric.bridge.get() || !([
      `${Bridge.BridgeType.Tailpiece}`,
      `${Bridge.BridgeType.NearTailpiece}`,
      `${Bridge.BridgeType.Tuneomatic}`,
    ].includes(ctx.electric.bridge.get()!.type.get()!))
  },{
    key: assistantStepKeys.knob,
    component : electricAssistant.knob,
  },{
    key : assistantStepKeys.jack,
    component : electricAssistant.jack,
  },{
    skip : (ctx)=>ctx.electric.guitarModel.get()?.selectedPickguard.get() === undefined,
    key : assistantStepKeys.pickguardMaterial,
    component : commonAssistant.pickguardMaterial,
  },
  {
    key : assistantStepKeys.pickupConfiguration,
    component : electricAssistant.pickupConfiguration,
  },{
    key : assistantStepKeys.bridgePickup,
    component : electricAssistant.bridgePickup,
  },{
    key : assistantStepKeys.middlePickup,
    component : electricAssistant.middlePickup,
    skip : (ctx)=>!ctx.electric.pickupConfiguration.get() || ({...Pickup.pickupConfigurations['electric-guitar'], ...Pickup.pickupConfigurations['electric-bass']}[ctx.electric.pickupConfiguration.get()!].length < 3)
  },{
    key : assistantStepKeys.neckPickup,
    component : electricAssistant.neckPickup,
    skip : (ctx)=>!ctx.electric.pickupConfiguration.get() || ({...Pickup.pickupConfigurations['electric-guitar'], ...Pickup.pickupConfigurations['electric-bass']}[ctx.electric.pickupConfiguration.get()!].length < 2) 
  }
]