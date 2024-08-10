"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectedElectricCalculator = exports.mustImplementCalculationKeys = void 0;
//@ts-nocheck
const _1 = require(".");
const electric_model_1 = require("./electric-model");
const GuitarBuilder = __importStar(require("./guitar-builder"));
exports.mustImplementCalculationKeys = ['bridge', 'bridgePickup', 'guitarModel', 'headstock', 'knob', 'middlePickup', 'neckPickup', 'nut', 'peg', 'bridge2', 'pickguardMaterial'];
exports.selectedElectricCalculator = {
    backBinding: (item) => GuitarBuilder.bindings[item].price ?? 0,
    backContour: (item) => electric_model_1.backContourPrice[item],
    bodyCoreWood: (item) => GuitarBuilder.bodyCoreWoods[item].price ?? 0,
    bodyLogo: (item) => GuitarBuilder.bodyLogo[item].price ?? 0,
    bodyTopWood: (item) => GuitarBuilder.bodyTopWoods[item].price ?? 0,
    bodyType: (item) => GuitarBuilder.electricBodyTypes[item].price ?? 0,
    topBodyColor: (item) => 0, //TODO: Implement this
    topBodyColorType: (item) => GuitarBuilder.bodyColorType[item].price ?? 0,
    backBodyColor: (item) => 0, //TODO: Implement this
    backBodyColorType: (item) => GuitarBuilder.bodyColorType[item].price ?? 0,
    burstType: (item) => GuitarBuilder.burstTypes[item].price ?? 0,
    burstColor: (item) => (_1.Colors.burstColors[item].value.length - 1) * 50000,
    carbonFiberRod: (item) => item ? 200000 : 0,
    constructionMethod: (item) => electric_model_1.constructionPrice[item],
    inlay: (item) => GuitarBuilder.inlayTypes[item].price ?? 0,
    jack: (item) => GuitarBuilder.jackTypes[item].price ?? 0,
    fingerboardEdge: (item) => GuitarBuilder.fingerboardEdge[item].price ?? 0,
    fingerboardRadius: (item) => GuitarBuilder.fingerboardRadius[item].price ?? 0,
    fingerboardWood: (item) => GuitarBuilder.fingerboardWoods[item].price ?? 0,
    fretCount: (item) => GuitarBuilder.fretCount[item].price ?? 0,
    headstockBinding: (item) => GuitarBuilder.bindings[item].price ?? 0,
    headstockLogo: (item) => GuitarBuilder.headstockLogo[item].price ?? 0,
    headstockOverlay: (item) => GuitarBuilder.headstockOverlay[item].price ?? 0,
    neckBinding: (item) => GuitarBuilder.bindings[item].price ?? 0,
    neckProfile: (item) => GuitarBuilder.neckProfiles[item].price ?? 0,
    neckColor: (item) => 0, //TODO: Implement this
    neckColorType: (item) => GuitarBuilder.neckColorType[item].price ?? 0,
    neckWood: (item) => GuitarBuilder.neckWoods[item].price ?? 0,
    pickupConfiguration: (item) => 0,
    scaleLength: (item) => ({ ...GuitarBuilder.scaleLengths['electric-guitar'], ...GuitarBuilder.scaleLengths['electric-bass'] }[item]).price ?? 0,
    sideInlay: (item) => GuitarBuilder.sideInlay[item].price ?? 0,
    stringCount: (item) => ({ ...GuitarBuilder.stringCounts['electric-guitar'], ...GuitarBuilder.stringCounts['electric-bass'] }[item]).price ?? 0,
    topBinding: (item) => GuitarBuilder.bindings[item].price ?? 0,
    topContour: (item) => electric_model_1.topContourPrice[item],
    trussRodType: (item) => GuitarBuilder.TrussRodType[item].price ?? 0,
    trussRodPosition: (item) => GuitarBuilder.trussRodPositions['electric'][item].price ?? 0,
    useFret: (item) => 0,
};
//# sourceMappingURL=calculate-price.js.map