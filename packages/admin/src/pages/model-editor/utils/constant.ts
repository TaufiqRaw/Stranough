import { GuitarBody } from "stranough-server/dist/entities";
import { GuitarBodyTextureKeyType, GuitarBodyTextureMediaKeyType, GuitarModelBodyKeyType } from "./types";

export const guitarBodyTextureMediaKey = Object.freeze(['frontHoleMask', 'mask', 'backMask', 'frontShadowTexture', 'backShadowTexture', 'frontSpecularTexture', 'backSpecularTexture'] as const);

export const guitarBodyTextureKey = Object.freeze(['flatTopBackTexture', 'forearmCutTexture', 'tummyCutTexture', 'forearmTummyCutTexture', 'carvedTopTexture', 'carvedTopBackTexture', 'carvedTopTummyCutTexture'] as const);

export const guitarModelBodyKey = Object.freeze(['boltOnBody', 'neckThroughBody', 'setInBody'] as const);

export enum GuitarBodySPEnum {
  fingerboard = 1, bridge, switch, jackSide, jackTop, pickupNeck , pickupMiddle, pickupBridge, knobs
}
