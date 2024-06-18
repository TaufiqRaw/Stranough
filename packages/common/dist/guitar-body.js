"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backContourKeys = exports.topContourKeys = exports.contourKeys = void 0;
exports.contourKeys = Object.freeze([
    "topFlatContour",
    "topCarvedContour",
    "topForearmContour",
    "backFlatContour",
    "backCarvedContour",
    "backTummyContour",
]);
exports.topContourKeys = exports.contourKeys.filter((key) => key.startsWith("top"));
exports.backContourKeys = exports.contourKeys.filter((key) => key.startsWith("back"));
//# sourceMappingURL=guitar-body.js.map