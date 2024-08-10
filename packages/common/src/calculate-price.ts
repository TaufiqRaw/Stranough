//@ts-nocheck
import { Colors } from ".";
import { backContourPrice, constructionPrice, topContourPrice } from "./electric-model";
import * as GuitarBuilder from "./guitar-builder";
import * as R from "remeda";

export const mustImplementCalculationKeys = ['bridge', 'bridgePickup', 'guitarModel', 'headstock', 'knob', 'middlePickup', 'neckPickup', 'nut', 'peg', 'bridge2', 'pickguardMaterial'] as const;

export type MustImplementCalculation = typeof mustImplementCalculationKeys[number];

export const selectedElectricCalculator : {[k in keyof Omit<GuitarBuilder.SelectedItem['electric'], MustImplementCalculation>] : (item : GuitarBuilder.SelectedItem['electric'][k]) => number} = {
  backBinding : (item) => GuitarBuilder.bindings[item].price ?? 0, 
  backContour : (item)=> backContourPrice[item],
  bodyCoreWood : (item) => GuitarBuilder.bodyCoreWoods[item].price ?? 0,
  bodyLogo : (item) => GuitarBuilder.bodyLogo[item].price ?? 0,
  bodyTopWood : (item) => GuitarBuilder.bodyTopWoods[item].price ?? 0,
  bodyType : (item) => GuitarBuilder.electricBodyTypes[item].price ?? 0,
  topBodyColor : (item) => 0, //TODO: Implement this
  topBodyColorType : (item) => GuitarBuilder.bodyColorType[item].price ?? 0,
  backBodyColor : (item) => 0, //TODO: Implement this
  backBodyColorType : (item) => GuitarBuilder.bodyColorType[item].price ?? 0,
  burstType : (item) => GuitarBuilder.burstTypes[item].price ?? 0,
  burstColor : (item) => (Colors.burstColors[item].value.length - 1) * 50000,
  carbonFiberRod : (item) => item ? 200000 : 0,
  constructionMethod : (item) => constructionPrice[item],
  inlay : (item) => GuitarBuilder.inlayTypes[item].price ?? 0,
  jack : (item) => GuitarBuilder.jackTypes[item].price ?? 0,
  fingerboardEdge : (item) => GuitarBuilder.fingerboardEdge[item].price ?? 0,
  fingerboardRadius : (item) => GuitarBuilder.fingerboardRadius[item].price ?? 0,
  fingerboardWood : (item) => GuitarBuilder.fingerboardWoods[item].price ?? 0,
  fretCount : (item) => GuitarBuilder.fretCount[item].price ?? 0,
  headstockBinding : (item) => GuitarBuilder.bindings[item].price ?? 0,
  headstockLogo : (item) => GuitarBuilder.headstockLogo[item].price ?? 0,
  headstockOverlay : (item) => GuitarBuilder.headstockOverlay[item].price ?? 0,
  neckBinding : (item) => GuitarBuilder.bindings[item].price ?? 0,
  neckProfile : (item) => GuitarBuilder.neckProfiles[item].price ?? 0,
  neckColor : (item) => 0, //TODO: Implement this
  neckColorType : (item) => GuitarBuilder.neckColorType[item].price ?? 0,
  neckWood : (item) => GuitarBuilder.neckWoods[item].price ?? 0,
  pickupConfiguration : (item)=> 0,
  scaleLength : (item) => ({...GuitarBuilder.scaleLengths['electric-guitar'], ...GuitarBuilder.scaleLengths['electric-bass']}[item]).price ?? 0,
  sideInlay : (item) => GuitarBuilder.sideInlay[item].price ?? 0,
  stringCount : (item) => ({...GuitarBuilder.stringCounts['electric-guitar'], ...GuitarBuilder.stringCounts['electric-bass']}[item]).price ?? 0,
  topBinding : (item) => GuitarBuilder.bindings[item].price ?? 0,
  topContour : (item) => topContourPrice[item],
  trussRodType : (item) => GuitarBuilder.TrussRodType[item].price ?? 0,
  trussRodPosition : (item) => GuitarBuilder.trussRodPositions['electric'][item].price ?? 0,
  useFret : (item) => 0,
}