import * as GuitarBuilder from "./guitar-builder";
export declare const mustImplementCalculationKeys: readonly ["bridge", "bridgePickup", "guitarModel", "headstock", "knob", "middlePickup", "neckPickup", "nut", "peg", "bridge2", "pickguardMaterial", "pickguard"];
export type MustImplementCalculation = typeof mustImplementCalculationKeys[number];
export declare const selectedElectricCalculator: {
    [k in keyof Omit<GuitarBuilder.SelectedItem['electric'], MustImplementCalculation>]: (item: GuitarBuilder.SelectedItem['electric'][k]) => number;
};
