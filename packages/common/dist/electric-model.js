"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contourSpecKeys = exports.contourShadowKeys = exports.contourKeys = exports.constructionMaskKeys = exports.constructionKeys = exports.spawnPointKeys = void 0;
exports.spawnPointKeys = Object.freeze([
    "knobSpawnPoint",
    "bridgeSpawnPoint",
    "pickupSpawnPoint",
    "switchSpawnPoint",
    "topJackSpawnPoint",
    "sideJackSpawnPoint",
    "fingerboardSpawnPoint",
    "fingerboardBackEndSpawnPoint",
    "pickguardSpawnPoint"
]);
exports.constructionKeys = Object.freeze([
    "boltOnConstruction",
    "setInConstruction",
    "neckThroughConstruction",
]);
exports.constructionMaskKeys = exports.constructionKeys.map((key) => `${key}Mask`);
exports.contourKeys = Object.freeze([
    "flatContour",
    "carvedContour",
    "forearmContour",
    "tummyContour",
]);
exports.contourShadowKeys = exports.contourKeys.map((key) => `${key}Shadow`);
exports.contourSpecKeys = exports.contourKeys.map((key) => `${key}Spec`);
//# sourceMappingURL=electric-model.js.map