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
exports.contourLabels = exports.contourOverlayKeys = exports.topContourPrice = exports.backContourPrice = exports.contourKeys = exports.backContourKeys = exports.topContourKeys = exports.constructionLabels = exports.constructionPrice = exports.constructionKeys = exports.spawnPointKeys = void 0;
const R = __importStar(require("remeda"));
exports.spawnPointKeys = Object.freeze([
    "knobSpawnPoint",
    "bridgeSpawnPoint",
    "pickupSpawnPoint",
    "switchSpawnPoint",
    "topJackSpawnPoint",
    "sideJackSpawnPoint",
    "fingerboardSpawnPoint",
    "fingerboardBackEndSpawnPoint",
    "pickguardSpawnPoint",
    "soundHoleSpawnPointLeft",
    "soundHoleSpawnPointRight",
    "electronicsSpawnPoint",
    "minorElectronicCoverSpawnPoint",
    "batteryCoverSpawnPoint",
    "logoSpawnPoint", ,
    "topSpawnPoint",
    "bottomSpawnPoint",
]);
exports.constructionKeys = Object.freeze([
    "boltOnConstruction",
    "setInConstruction",
    "neckThroughConstruction",
]);
exports.constructionPrice = Object.freeze({
    boltOnConstruction: 0,
    setInConstruction: 0,
    neckThroughConstruction: 850000,
});
exports.constructionLabels = Object.freeze({
    boltOnConstruction: "Bolt On",
    setInConstruction: "Set In",
    neckThroughConstruction: "Neck Through",
});
exports.topContourKeys = Object.freeze([
    "flatContour",
    "carvedContour",
    "forearmContour",
]);
exports.backContourKeys = Object.freeze([
    "flatContour",
    "carvedContour",
    "tummyContour",
]);
exports.contourKeys = R.pipe(exports.topContourKeys, R.concat(exports.backContourKeys), R.unique());
exports.backContourPrice = Object.freeze({
    flatContour: 0,
    carvedContour: 200000,
    tummyContour: 75000,
});
exports.topContourPrice = Object.freeze({
    flatContour: 0,
    carvedContour: 200000,
    forearmContour: 75000,
});
exports.contourOverlayKeys = exports.contourKeys.map((key) => `${key}Overlay`);
exports.contourLabels = Object.freeze({
    flatContour: "Flat",
    carvedContour: "Carved",
    tummyContour: "Tummy",
    forearmContour: "Forearm",
});
//# sourceMappingURL=electric-model.js.map