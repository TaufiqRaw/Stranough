"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contourSpecKeys = exports.contourShadowKeys = exports.contourKeys = exports.bodyKeys = exports.spawnPointKeys = void 0;
exports.spawnPointKeys = Object.freeze([
    "knobSpawnPoint",
    "bridgeSpawnPoint",
    "pickupSpawnPoint",
    "switchSpawnPoint",
    "topJackSpawnPoint",
    "sideJackSpawnPoint",
    "fingerboardSpawnPoint",
    "fingerboardBackEndSpawnPoint",
]);
exports.bodyKeys = Object.freeze([
    "boltOnBodyMask",
    "neckThroughBodyMask",
    "setInBodyMask",
]);
exports.contourKeys = Object.freeze([
    "flatContour",
    "carvedContour",
    "forearmContour",
    "tummyContour",
]);
exports.contourShadowKeys = exports.contourKeys.map((key) => `${key}Shadow`);
exports.contourSpecKeys = exports.contourKeys.map((key) => `${key}Spec`);
//# sourceMappingURL=guitar-model.js.map